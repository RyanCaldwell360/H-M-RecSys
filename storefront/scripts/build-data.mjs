import { createHash } from "node:crypto";
import {
  existsSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const storefrontRoot = resolve(scriptDirectory, "..");
const repositoryRoot = resolve(storefrontRoot, "..");
const dataDirectory = join(repositoryRoot, "data");
const migrationDirectory = join(storefrontRoot, "drizzle");
const publicDataDirectory = join(storefrontRoot, "public", "data");
const cohortSize = Number.parseInt(process.env.HM_COHORT_SIZE ?? "1000", 10);

if (!Number.isInteger(cohortSize) || cohortSize < 1) {
  throw new Error("HM_COHORT_SIZE must be a positive integer");
}

const articlePath = join(dataDirectory, "articles.csv");
const transactionPath = join(dataDirectory, "sample_transactions.csv");

for (const path of [articlePath, transactionPath]) {
  if (!existsSync(path)) throw new Error(`Missing source data: ${path}`);
}

function csv(text) {
  return parse(text, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  });
}

function sqlText(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : String(fallback);
}

function deterministicKey(value) {
  return createHash("sha256").update(value).digest("hex");
}

function insertStatements(table, columns, rows, size = 80) {
  const statements = [];
  for (let index = 0; index < rows.length; index += size) {
    const values = rows.slice(index, index + size).join(",\n");
    statements.push(
      `INSERT INTO "${table}" (${columns.map((column) => `"${column}"`).join(", ")}) VALUES\n${values};`,
    );
  }
  return statements.join("\n\n");
}

function removeGeneratedSeedMigrations() {
  if (!existsSync(migrationDirectory)) return;
  for (const name of readdirSync(migrationDirectory)) {
    if (/^\d{4}_hm_(articles|customers|transactions|search)_.*\.sql$/.test(name)) {
      rmSync(join(migrationDirectory, name));
    }
  }
}

function nextMigrationNumber() {
  const numbers = readdirSync(migrationDirectory)
    .map((name) => /^(\d{4})_.*\.sql$/.exec(name)?.[1])
    .filter(Boolean)
    .map(Number);
  return (numbers.length ? Math.max(...numbers) + 1 : 0);
}

const [articleCsv, transactionCsv] = await Promise.all([
  readFile(articlePath, "utf8"),
  readFile(transactionPath, "utf8"),
]);
const sourceArticles = csv(articleCsv);
const sourceTransactions = csv(transactionCsv);

const transactionsByCustomer = new Map();
const popularityByArticle = new Map();
for (const transaction of sourceTransactions) {
  const history = transactionsByCustomer.get(transaction.customer_id) ?? [];
  history.push(transaction);
  transactionsByCustomer.set(transaction.customer_id, history);
  popularityByArticle.set(
    transaction.article_id,
    (popularityByArticle.get(transaction.article_id) ?? 0) + 1,
  );
}

const eligibleCustomers = [...transactionsByCustomer.entries()]
  .filter(([, history]) => history.length >= 2)
  .sort(([left], [right]) => deterministicKey(left).localeCompare(deterministicKey(right)));

if (eligibleCustomers.length < cohortSize) {
  throw new Error(
    `Requested ${cohortSize} customers, but only ${eligibleCustomers.length} have two or more interactions.`,
  );
}

const selectedCustomers = eligibleCustomers
  .slice(0, cohortSize)
  .sort((left, right) =>
    right[1].length - left[1].length || deterministicKey(left[0]).localeCompare(deterministicKey(right[0])),
  )
  .map(([customerId, history], index) => ({
    customerId,
    cohortRank: index + 1,
    label: `Shopper ${String(index + 1).padStart(4, "0")}`,
    history: history.sort((left, right) =>
      left.t_dat.localeCompare(right.t_dat) || left.article_id.localeCompare(right.article_id),
    ),
  }));

const selectedCustomerIds = new Set(selectedCustomers.map((customer) => customer.customerId));
const selectedTransactions = sourceTransactions.filter((transaction) =>
  selectedCustomerIds.has(transaction.customer_id),
);

await mkdir(migrationDirectory, { recursive: true });
await mkdir(publicDataDirectory, { recursive: true });
removeGeneratedSeedMigrations();
let migrationNumber = nextMigrationNumber();

const articleRows = sourceArticles.map((article) => {
  const imagePath = join(dataDirectory, "images", `${article.article_id}.jpg`);
  const hasImage = existsSync(imagePath);
  return `(${[
    sqlText(article.article_id),
    sqlText(article.product_code),
    sqlText(article.prod_name || "Unnamed item"),
    sqlText(article.product_type_name || "Unknown"),
    sqlText(article.product_group_name || "Unknown"),
    sqlText(article.graphical_appearance_name || "Unknown"),
    sqlText(article.colour_group_name || "Unknown"),
    sqlText(article.perceived_colour_value_name || "Unknown"),
    sqlText(article.department_name || "Unknown"),
    sqlText(article.index_name || "Unknown"),
    sqlText(article.index_group_name || "Unknown"),
    sqlText(article.section_name || "Unknown"),
    sqlText(article.garment_group_name || "Unknown"),
    sqlText(article.detail_desc),
    hasImage ? sqlText(`/products/${article.article_id}.jpg`) : "NULL",
    hasImage ? "1" : "0",
    sqlNumber(popularityByArticle.get(article.article_id)),
  ].join(", ")})`;
});

const articleColumns = [
  "article_id", "product_code", "name", "product_type", "product_group",
  "appearance", "colour", "perceived_colour", "department", "index_name",
  "index_group", "section", "garment_group", "description", "image_path",
  "has_image", "popularity",
];
const articlesPerMigration = 10_000;
for (let index = 0; index < articleRows.length; index += articlesPerMigration) {
  const shard = Math.floor(index / articlesPerMigration) + 1;
  const rows = articleRows.slice(index, index + articlesPerMigration);
  const name = `${String(migrationNumber++).padStart(4, "0")}_hm_articles_${String(shard).padStart(2, "0")}.sql`;
  await writeFile(
    join(migrationDirectory, name),
    `${insertStatements("articles", articleColumns, rows)}\n`,
  );
}

const customerRows = selectedCustomers.map((customer) => {
  const dates = customer.history.map((transaction) => transaction.t_dat).sort();
  return `(${[
    sqlText(customer.customerId),
    customer.cohortRank,
    sqlText(customer.label),
    customer.history.length,
    sqlText(dates[0]),
    sqlText(dates.at(-1)),
  ].join(", ")})`;
});
await writeFile(
  join(migrationDirectory, `${String(migrationNumber++).padStart(4, "0")}_hm_customers_01.sql`),
  `${insertStatements(
    "customers",
    ["customer_id", "cohort_rank", "label", "history_count", "first_purchase_at", "last_purchase_at"],
    customerRows,
  )}\n`,
);

const transactionRows = selectedTransactions.map((transaction) =>
  `(${[
    sqlText(transaction.customer_id),
    sqlText(transaction.t_dat),
    sqlText(transaction.article_id),
    sqlNumber(transaction.price),
  ].join(", ")})`,
);
await writeFile(
  join(migrationDirectory, `${String(migrationNumber++).padStart(4, "0")}_hm_transactions_01.sql`),
  `${insertStatements(
    "transactions",
    ["customer_id", "purchased_at", "article_id", "price"],
    transactionRows,
    150,
  )}\n`,
);

await writeFile(
  join(migrationDirectory, `${String(migrationNumber++).padStart(4, "0")}_hm_search_01.sql`),
  [
    "CREATE VIRTUAL TABLE articles_fts USING fts5(article_id UNINDEXED, name, product_type, colour, section, garment_group);",
    "INSERT INTO articles_fts (article_id, name, product_type, colour, section, garment_group) SELECT article_id, name, product_type, colour, section, garment_group FROM articles;",
    "PRAGMA optimize;",
    "",
  ].join("\n"),
);

const cohort = selectedCustomers.map((customer) => ({
  rank: customer.cohortRank,
  label: customer.label,
  historyCount: customer.history.length,
  firstPurchaseAt: customer.history[0].t_dat,
  lastPurchaseAt: customer.history.at(-1).t_dat,
  transactions: customer.history.map((transaction) => ({
    purchasedAt: transaction.t_dat,
    articleId: transaction.article_id,
    price: Number(transaction.price),
  })),
}));

const historyDistribution = Object.fromEntries(
  [...new Set(cohort.map((customer) => customer.historyCount))]
    .sort((left, right) => left - right)
    .map((count) => [count, cohort.filter((customer) => customer.historyCount === count).length]),
);
const summary = {
  source: "H&M Personalized Fashion Recommendations",
  catalogArticles: sourceArticles.length,
  sourceTransactions: sourceTransactions.length,
  sourceCustomers: transactionsByCustomer.size,
  eligibleCustomers: eligibleCustomers.length,
  selectedCustomers: cohort.length,
  selectedTransactions: selectedTransactions.length,
  photographedArticles: sourceArticles.filter((article) =>
    existsSync(join(dataDirectory, "images", `${article.article_id}.jpg`)),
  ).length,
  transactionDateRange: {
    first: sourceTransactions.map((transaction) => transaction.t_dat).sort()[0],
    last: sourceTransactions.map((transaction) => transaction.t_dat).sort().at(-1),
  },
  selection: "Deterministic SHA-256 sample from customers with at least two interactions",
  historyDistribution,
};

await Promise.all([
  writeFile(join(publicDataDirectory, "customer-cohort.json"), `${JSON.stringify(cohort)}\n`),
  writeFile(join(publicDataDirectory, "cohort-summary.json"), `${JSON.stringify(summary, null, 2)}\n`),
]);

writeFileSync(
  join(publicDataDirectory, "README.txt"),
  "Generated by npm run data:build from ../../data/articles.csv and ../../data/sample_transactions.csv. Do not edit by hand.\n",
);

console.log(JSON.stringify(summary, null, 2));

import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable(
  "articles",
  {
    articleId: text("article_id").primaryKey(),
    productCode: text("product_code").notNull(),
    name: text("name").notNull(),
    productType: text("product_type").notNull(),
    productGroup: text("product_group").notNull(),
    appearance: text("appearance").notNull(),
    colour: text("colour").notNull(),
    perceivedColour: text("perceived_colour").notNull(),
    department: text("department").notNull(),
    indexName: text("index_name").notNull(),
    indexGroup: text("index_group").notNull(),
    section: text("section").notNull(),
    garmentGroup: text("garment_group").notNull(),
    description: text("description"),
    imagePath: text("image_path"),
    hasImage: integer("has_image", { mode: "boolean" }).notNull().default(false),
    popularity: integer("popularity").notNull().default(0),
  },
  (table) => [
    index("idx_articles_product_type").on(table.productType),
    index("idx_articles_colour").on(table.colour),
    index("idx_articles_index_name").on(table.indexName),
    index("idx_articles_popularity").on(table.popularity),
  ],
);

export const customers = sqliteTable(
  "customers",
  {
    customerId: text("customer_id").primaryKey(),
    cohortRank: integer("cohort_rank").notNull(),
    label: text("label").notNull(),
    historyCount: integer("history_count").notNull(),
    firstPurchaseAt: text("first_purchase_at").notNull(),
    lastPurchaseAt: text("last_purchase_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_customers_cohort_rank").on(table.cohortRank),
    index("idx_customers_history_count").on(table.historyCount),
  ],
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    customerId: text("customer_id").notNull().references(() => customers.customerId),
    purchasedAt: text("purchased_at").notNull(),
    articleId: text("article_id").notNull().references(() => articles.articleId),
    price: real("price").notNull(),
  },
  (table) => [
    index("idx_transactions_customer_date").on(table.customerId, table.purchasedAt),
    index("idx_transactions_article").on(table.articleId),
  ],
);

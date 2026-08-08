import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("https://hm-for-you.test/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished personalized storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /H&amp;M For You/);
  assert.match(html, /Looks that/);
  assert.match(html, /Your daily edit/);
  assert.match(html, /Shopper<br\/>signal lab/);
  assert.match(html, /Shop the edit/);
  assert.match(html, /The catalog<br\/>archive/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("ships the full catalog cohort, photographed products, and social metadata", async () => {
  const [page, layout, catalog, productImages, packageJson, summary, migrations, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/catalog.ts", import.meta.url), "utf8"),
    readdir(new URL("../public/products/", import.meta.url)),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../public/data/cohort-summary.json", import.meta.url), "utf8").then(JSON.parse),
    readdir(new URL("../drizzle/", import.meta.url)),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8").then(JSON.parse),
  ]);
  assert.equal(productImages.filter((name) => name.endsWith(".jpg")).length, 20);
  assert.equal(summary.catalogArticles, 105542);
  assert.equal(summary.selectedCustomers, 1000);
  assert.equal(summary.selectedTransactions, 2248);
  assert.equal(migrations.filter((name) => name.endsWith(".sql")).length, 15);
  assert.equal(hosting.d1, "DB");
  assert.match(page, /recommend\(profileId\)/);
  assert.match(catalog, /Recent popularity|maximumPopularity/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
});

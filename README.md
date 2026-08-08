# H&M Personalized Fashion Storefront

A production-like fashion storefront built on the [H&M Personalized Fashion Recommendations](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations) dataset. The project pairs a polished shopping experience with an intentionally visible recommendation layer so it can grow into both a RecSys learning project and a portfolio case study.

> This is an educational portfolio project and is not affiliated with H&M.

## What works today

- All 105,542 article metadata records are stored in an indexed D1/SQLite catalog.
- Full-text catalog search and server-side pagination keep the browser payload small.
- A reproducible cohort contains 1,000 anonymous customers and all 2,248 of their available interactions.
- The shopper signal lab shows real purchase histories and baseline next-item recommendations.
- Twenty sampled articles include their real product photography; metadata-first placeholders honestly represent the remaining catalog.
- Search, filters, favourites, product details, sizes, and a demo bag remain available in the photographed storefront edit.
- The app builds as a Cloudflare-compatible worker under `storefront/`.

## Dataset scope

The checked-in transaction sample is not the full Kaggle transaction table. It contains:

- 8,784 interactions from 7,315 customers
- A date window of September 16-22, 2020
- 1,181 customers with at least two interactions
- Transactions for the same 20 articles whose images are present in this repo

The generated 1,000-customer cohort is a deterministic SHA-256 sample from those 1,181 eligible customers. Every available interaction for each selected customer is preserved. This makes local rebuilds stable while avoiding an activity-biased "top customers only" sample.

## Project structure

```text
H-M-RecSys/
|-- storefront/                 # Active React storefront
|   |-- app/api/                # Catalog and customer-history APIs
|   |-- app/components/         # Catalog archive and shopper explorer
|   |-- db/schema.ts            # D1/SQLite schema and indexes
|   |-- drizzle/                # Schema and generated data migrations
|   |-- scripts/build-data.mjs  # Reproducible cohort/catalog preprocessing
|   `-- public/data/            # Small generated browser-facing artifacts
|-- app/                        # Original Streamlit prototype
`-- data/                       # Source catalog, transactions, and 20 images
```

## Rebuild the data layer

The storefront requires Node.js 22.13 or newer.

```bash
cd storefront
npm install
npm run data:refresh
npm run db:local:apply
npm run dev
```

`data:refresh` regenerates the schema migration, the deterministic customer cohort, the catalog seed shards, the transaction seed, and the full-text search index. `db:local:apply` loads those migrations into the local D1 database.

Open `http://localhost:3000`. Build and test with:

```bash
npm test
```

## Data APIs

- `GET /api/catalog?page=1&limit=24&q=denim` searches and paginates the complete catalog.
- `GET /api/customers?page=1&limit=25` lists anonymous cohort members.
- `GET /api/customers/1` returns Shopper 0001's complete available history and baseline recommendations.

The public API uses cohort ranks and labels rather than exposing the dataset's full customer hashes.

## Baseline recommender

The customer-history API excludes previously purchased items and combines four inspectable signals:

| Signal | Weight | Purpose |
| --- | ---: | --- |
| Recent popularity | 35% | Ground recommendations in observed sample demand |
| Category affinity | 30% | Match categories represented in purchase history |
| Colour affinity | 20% | Match observed colour families |
| Collection + discovery | 15% | Preserve department affinity while allowing novelty |

This is a data-integration baseline, not a claim of recommendation quality. Its main job is to establish a stable API contract that learned models can replace.

## Roadmap to TIGER

The target architecture is Google's [TIGER: Recommender Systems with Generative Retrieval](https://arxiv.org/abs/2305.05065). A practical implementation path is:

1. Replace the one-week transaction sample with the complete Kaggle transaction table.
2. Create temporal train/validation/test splits and Recall@K/NDCG@K evaluation.
3. Add co-visitation, popularity, and sequential baselines behind the existing recommendation API.
4. Encode product content and learn hierarchical Semantic IDs with residual quantization.
5. Train a Transformer encoder-decoder to predict next-item Semantic IDs autoregressively.
6. Add constrained beam-search retrieval, collision handling, cold-start evaluation, and latency measurements.

The storefront and API contract can stay stable while each model iteration becomes measurable.

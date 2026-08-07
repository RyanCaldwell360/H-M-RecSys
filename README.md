# H&M Personalized Fashion Storefront

A production-like fashion storefront built on the [H&M Personalized Fashion Recommendations](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations) dataset. The project pairs a polished shopping experience with an intentionally visible recommendation layer so it can grow into both a useful RecSys learning project and a portfolio case study.

> This is an educational portfolio project and is not affiliated with H&M.

## What works today

- A responsive storefront using 20 real catalog records and their product photography
- Three demo shopper profiles that rerank the collection in real time
- An explainable popularity + affinity baseline recommender
- Search, category filters, favourites, product details, size selection, and a demo bag
- A model explainer that shows the current signals and the path to TIGER
- A Cloudflare-compatible production build under `storefront/`

## Project structure

```text
H-M-RecSys/
├── storefront/            # Modern React storefront (active product surface)
│   ├── app/
│   │   ├── data/          # Typed catalog and baseline recommender
│   │   ├── page.tsx       # Storefront experience and interactions
│   │   └── globals.css    # Responsive editorial design system
│   └── public/products/   # Local product photography
├── app/                   # Original Streamlit prototype (legacy reference)
└── data/                  # H&M sample catalog, transactions, and source images
```

## Run the storefront

The storefront requires Node.js 22.13 or newer.

```bash
cd storefront
npm install
npm run dev
```

Open `http://localhost:3000`.

Build the deployable version with:

```bash
npm run build
```

## Baseline recommender

The current recommender lives in `storefront/app/data/catalog.ts`. It excludes known purchases and combines four inspectable signals:

| Signal | Weight | Purpose |
| --- | ---: | --- |
| Recent popularity | 35% | Ground recommendations in observed sample demand |
| Category affinity | 30% | Match categories represented in the shopper profile |
| Colour affinity | 20% | Match preferred colour families |
| Collection + discovery | 15% | Preserve department affinity while allowing novelty |

This is a UI-enabling baseline, not a claim of recommendation quality. Its main job is to establish a stable product contract that a learned model can replace later.

## Roadmap to TIGER

The target architecture is Google’s [TIGER: Recommender Systems with Generative Retrieval](https://arxiv.org/abs/2305.05065). A practical implementation path for this repo is:

1. Create temporal train/validation/test splits and baseline Recall@K/NDCG@K evaluation.
2. Move recommendation logic behind a small service contract while keeping the storefront unchanged.
3. Encode product content and learn hierarchical Semantic IDs with residual quantization.
4. Convert customer histories into Semantic ID sequences and train a Transformer encoder-decoder to predict the next item ID autoregressively.
5. Add constrained beam-search retrieval, collision handling, cold-start evaluation, and online latency measurements.
6. Compare popularity, co-visitation, matrix factorization, sequential baselines, and TIGER under the same evaluation harness.

That progression keeps the site useful at every stage and makes improvements measurable instead of swapping models without evidence.

## Legacy Streamlit prototype

The original exploratory app remains in `app/` for reference. The modern storefront is the active interface and should be the integration target for future models.

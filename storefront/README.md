# Storefront

The active H&M recommendation storefront. It uses vinext/React, Cloudflare D1, the full 105,542-article metadata catalog, and a deterministic cohort of 1,000 customers with 2,248 preserved interactions.

## Local setup

```bash
npm install
npm run data:refresh
npm run db:local:apply
npm run dev
```

## Useful commands

```bash
npm run data:build      # Regenerate seed migrations and cohort artifacts
npm run db:generate     # Generate schema migrations from db/schema.ts
npm run db:local:apply  # Apply all migrations to local D1
npm test                # Production build plus artifact/render checks
```

The source CSV files live one directory up under `data/`. See the root README for dataset limitations, API routes, recommendation weights, and the TIGER roadmap.

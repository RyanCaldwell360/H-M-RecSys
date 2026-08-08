"use client";

import { useCallback, useEffect, useState } from "react";

type ArchiveItem = {
  articleId: string;
  name: string;
  productType: string;
  productGroup: string;
  appearance: string;
  colour: string;
  indexName: string;
  section: string;
  garmentGroup: string;
  description: string | null;
  imagePath: string | null;
  hasImage: number;
  popularity: number;
};

type CatalogResponse = {
  items: ArchiveItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
  error?: string;
};

const quickSearches = ["Denim", "Dress", "Knitwear", "Black"];

export function CatalogArchive() {
  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const parameters = new URLSearchParams({ page: String(page), limit: "24" });
      if (query) parameters.set("q", query);
      const response = await fetch(`/api/catalog?${parameters}`);
      const payload = await response.json() as CatalogResponse;
      if (!response.ok) throw new Error(payload.error ?? "Catalog is unavailable");
      setData(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Catalog is unavailable");
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { void load(); }, [load]);

  const search = (nextQuery: string) => {
    setDraftQuery(nextQuery);
    setPage(1);
    setQuery(nextQuery.trim());
  };

  return (
    <section className="archive section-shell" id="catalog">
      <div className="archive-heading">
        <div><p className="eyebrow">105,542 article records · server-side search</p><h2>The catalog<br />archive</h2></div>
        <p>Every product metadata record is searchable. Twenty sampled products include photography; the rest remain honest metadata-first entries until the full Kaggle image archive is added.</p>
      </div>
      <form className="archive-search" onSubmit={(event) => { event.preventDefault(); search(draftQuery); }}>
        <span aria-hidden="true">⌕</span>
        <input value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} placeholder="Search name, type, colour, section…" aria-label="Search the full catalog" />
        <button type="submit">Search archive</button>
      </form>
      <div className="quick-searches"><span>Try</span>{quickSearches.map((value) => <button type="button" key={value} onClick={() => search(value)}>{value}</button>)}{query ? <button type="button" onClick={() => search("")}>Clear ×</button> : null}</div>

      <div className="archive-status"><span>{loading ? "Searching…" : `${data?.pagination.total.toLocaleString() ?? 0} matching articles`}</span>{query ? <small>Query: “{query}”</small> : <small>Ranked by observed popularity, then article ID</small>}</div>
      {error ? <div className="data-error"><strong>Couldn’t load the catalog.</strong><span>{error}</span><button type="button" onClick={() => void load()}>Try again</button></div> : null}
      <div className={`archive-grid ${loading ? "is-loading" : ""}`} aria-busy={loading}>
        {data?.items.map((item) => (
          <article className="archive-card" key={item.articleId}>
            <div className="archive-visual">
              {item.imagePath ? <img src={item.imagePath} alt={item.name} loading="lazy" /> : <div className="archive-placeholder"><span>{item.indexName}</span><b>{item.articleId}</b><small>Image archive not loaded</small></div>}
              {item.popularity ? <span className="archive-signal">{item.popularity} interactions</span> : null}
            </div>
            <div className="archive-copy"><span>{item.section}</span><h3>{item.name}</h3><p>{item.colour} · {item.productType}</p><small>{item.articleId}</small></div>
          </article>
        ))}
      </div>
      {data && data.pagination.pages > 1 ? (
        <div className="archive-pagination">
          <button type="button" disabled={page === 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))}>← Previous</button>
          <span>Page {data.pagination.page.toLocaleString()} of {data.pagination.pages.toLocaleString()}</span>
          <button type="button" disabled={page === data.pagination.pages || loading} onClick={() => setPage((value) => Math.min(data.pagination.pages, value + 1))}>Next →</button>
        </div>
      ) : null}
    </section>
  );
}

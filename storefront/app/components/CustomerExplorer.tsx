"use client";

import { useCallback, useEffect, useState } from "react";

type HistoryItem = {
  purchasedAt: string;
  price: number;
  articleId: string;
  name: string;
  productType: string;
  colour: string;
  imagePath: string | null;
};

type Recommendation = HistoryItem & { reason: string; score: number };

type CustomerData = {
  customer: { rank: number; label: string; historyCount: number; firstPurchaseAt: string; lastPurchaseAt: string };
  history: HistoryItem[];
  recommendations: Recommendation[];
};

export function CustomerExplorer() {
  const [rank, setRank] = useState(1);
  const [draftRank, setDraftRank] = useState("1");
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomer = useCallback(async (nextRank: number) => {
    const safeRank = Math.min(1_000, Math.max(1, nextRank));
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/customers/${safeRank}`);
      const payload = await response.json() as CustomerData & { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Customer history is unavailable");
      setRank(safeRank);
      setDraftRank(String(safeRank));
      setData(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Customer history is unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCustomer(1); }, [loadCustomer]);

  const submitRank = (event: React.FormEvent) => {
    event.preventDefault();
    void loadCustomer(Number.parseInt(draftRank, 10) || 1);
  };

  return (
    <section className="customer-lab section-shell" id="customer-lab">
      <div className="customer-lab-heading">
        <div>
          <p className="eyebrow">Real interaction histories · 1,000-customer cohort</p>
          <h2>Shopper<br />signal lab</h2>
        </div>
        <div className="customer-controls">
          <form onSubmit={submitRank}>
            <label htmlFor="shopper-rank">Jump to shopper</label>
            <div><span>#</span><input id="shopper-rank" type="number" min="1" max="1000" value={draftRank} onChange={(event) => setDraftRank(event.target.value)} /><button type="submit">Load</button></div>
          </form>
          <div className="customer-stepper">
            <button type="button" onClick={() => void loadCustomer(rank - 1)} disabled={rank === 1}>← Previous</button>
            <button type="button" onClick={() => void loadCustomer(Math.floor(Math.random() * 1_000) + 1)}>Surprise me</button>
            <button type="button" onClick={() => void loadCustomer(rank + 1)} disabled={rank === 1_000}>Next →</button>
          </div>
        </div>
      </div>

      {loading ? <div className="data-loading" role="status">Loading shopper history…</div> : null}
      {error ? <div className="data-error"><strong>Couldn’t load the cohort.</strong><span>{error}</span><button type="button" onClick={() => void loadCustomer(rank)}>Try again</button></div> : null}
      {data && !loading ? (
        <div className="customer-dashboard">
          <div className="customer-identity">
            <span>{String(data.customer.rank).padStart(4, "0")}</span>
            <div><p>Anonymous cohort member</p><h3>{data.customer.label}</h3><small>{data.customer.historyCount} purchases · {data.customer.firstPurchaseAt}–{data.customer.lastPurchaseAt}</small></div>
          </div>
          <div className="history-block">
            <div className="data-section-title"><span>Observed history</span><small>Every available purchase for this shopper</small></div>
            <div className="history-row">
              {data.history.map((item, index) => (
                <article className="history-card" key={`${item.articleId}-${item.purchasedAt}-${index}`}>
                  {item.imagePath ? <img src={item.imagePath} alt={item.name} /> : <div className="archive-placeholder"><span>{item.articleId}</span></div>}
                  <div><strong>{item.name}</strong><span>{item.colour} · {item.productType}</span><small>{item.purchasedAt}</small></div>
                </article>
              ))}
            </div>
          </div>
          <div className="recommendation-block">
            <div className="data-section-title"><span>Baseline next picks</span><small>Popularity + category + colour + collection affinity</small></div>
            <div className="history-row recommendation-row">
              {data.recommendations.slice(0, 6).map((item) => (
                <article className="history-card" key={item.articleId}>
                  {item.imagePath ? <img src={item.imagePath} alt={item.name} /> : <div className="archive-placeholder"><span>{item.articleId}</span></div>}
                  <div><p>{item.reason}</p><strong>{item.name}</strong><span>Score {Math.round(item.score * 100)}%</span></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  catalog,
  profiles,
  recommend,
  type Product,
  type ProfileId,
} from "./data/catalog";

const categoryFilters = [
  "All",
  "Knitwear",
  "Trousers",
  "Dresses",
  "Shirts & blouses",
  "Sport",
  "Outerwear",
] as const;

function categoryFor(product: Product) {
  if (product.indexName === "Sport") return "Sport";
  if (["Sweater", "Cardigan"].includes(product.type)) return "Knitwear";
  if (["Shirt", "Blouse", "Unknown"].includes(product.type)) {
    return "Shirts & blouses";
  }
  if (product.type === "Dress") return "Dresses";
  if (product.type === "Jacket") return "Outerwear";
  return product.type;
}

function ProductCard({
  product,
  reason,
  wished,
  onWish,
  onOpen,
}: {
  product: Product;
  reason?: string;
  wished: boolean;
  onWish: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="product-card">
      <button
        className="product-image-button"
        type="button"
        onClick={onOpen}
        aria-label={`View ${product.name}`}
      >
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge ? <span className="product-badge">{product.badge}</span> : null}
      </button>
      <button
        className={`heart-button ${wished ? "is-wished" : ""}`}
        type="button"
        onClick={onWish}
        aria-label={`${wished ? "Remove" : "Add"} ${product.name} ${
          wished ? "from" : "to"
        } favourites`}
        aria-pressed={wished}
      >
        {wished ? "♥" : "♡"}
      </button>
      <button className="product-copy" type="button" onClick={onOpen}>
        {reason ? <span className="reason-pill">{reason}</span> : null}
        <span className="product-name">{product.name}</span>
        <span className="product-meta">{product.colour}</span>
        <span className="product-price">${product.price.toFixed(2)}</span>
      </button>
    </article>
  );
}

export default function Home() {
  const [profileId, setProfileId] = useState<ProfileId>("maya");
  const [category, setCategory] = useState<(typeof categoryFilters)[number]>("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [bagCount, setBagCount] = useState(0);
  const [toast, setToast] = useState("");

  const profile = profiles[profileId];
  const recommendations = useMemo(() => recommend(profileId), [profileId]);
  const recommendedProducts = recommendations.slice(0, 8);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return catalog.filter((product) => {
      const inCategory = category === "All" || categoryFor(product) === category;
      const searchable = [
        product.name,
        product.type,
        product.colour,
        product.section,
        product.description,
      ]
        .join(" ")
        .toLowerCase();
      return inCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
        setSearchOpen(false);
        setModelOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected || searchOpen || modelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected, searchOpen, modelOpen]);

  const toggleWish = (id: string) => {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToBag = (product: Product) => {
    setBagCount((count) => count + 1);
    setToast(`${product.name}, size ${selectedSize}, added to bag`);
    setSelected(null);
    window.setTimeout(() => setToast(""), 2600);
  };

  const openProduct = (product: Product) => {
    setSelectedSize("M");
    setSelected(product);
  };

  return (
    <main>
      <div className="announcement">
        <span>Members get free shipping over $40</span>
        <span className="announcement-detail">Demo store · Real H&M competition data</span>
      </div>

      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="H&M For You home">
          H<span>&</span>M
        </a>
        <nav className="primary-nav" aria-label="Primary navigation">
          {['Women', 'Men', 'Divided', 'Kids', 'H&M Home', 'Beauty', 'Sale'].map((item) => (
            <a href="#catalog" key={item}>{item}</a>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Open search">
            <span aria-hidden="true">⌕</span><span className="action-label">Search</span>
          </button>
          <button type="button" aria-label={`${wishlist.size} favourites`}>
            <span aria-hidden="true">♡</span><span className="action-label">Favourites</span>
            {wishlist.size ? <b>{wishlist.size}</b> : null}
          </button>
          <button type="button" aria-label={`${bagCount} items in bag`}>
            <span aria-hidden="true">▱</span><span className="action-label">Bag</span>
            {bagCount ? <b>{bagCount}</b> : null}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Your personal edit · {profile.signal}</p>
          <h1>Looks that<br />get you.</h1>
          <p className="hero-description">
            A store that learns from what you love. Start with a style profile and watch
            your edit change in real time.
          </p>
          <div className="hero-actions">
            <a href="#for-you" className="primary-cta">Shop your edit</a>
            <button type="button" className="text-cta" onClick={() => setModelOpen(true)}>
              How we picked these <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="profile-picker">
            <span>Shopping as</span>
            <div className="profile-tabs" role="group" aria-label="Choose a demo shopper profile">
              {(Object.keys(profiles) as ProfileId[]).map((id) => (
                <button
                  type="button"
                  key={id}
                  className={profileId === id ? "active" : ""}
                  onClick={() => setProfileId(id)}
                  aria-pressed={profileId === id}
                >
                  {profiles[id].name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-products" aria-label="Featured products">
          <button type="button" className="hero-tile hero-tile-large" onClick={() => openProduct(recommendedProducts[0].product)}>
            <img src={recommendedProducts[0].product.image} alt={recommendedProducts[0].product.name} />
            <span>{recommendedProducts[0].reason}</span>
          </button>
          <button type="button" className="hero-tile" onClick={() => openProduct(recommendedProducts[1].product)}>
            <img src={recommendedProducts[1].product.image} alt={recommendedProducts[1].product.name} />
            <span>Match {Math.round(recommendedProducts[1].score * 100)}%</span>
          </button>
          <div className="hero-note">
            <span className="live-dot" />
            <strong>Personalization on</strong>
            <small>Refreshes with your style profile</small>
          </div>
        </div>
      </section>

      <section className="for-you section-shell" id="for-you">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated for {profile.name}</p>
            <h2>Your daily edit</h2>
            <p>{profile.description}</p>
          </div>
          <button type="button" className="explain-button" onClick={() => setModelOpen(true)}>
            <span className="spark">✦</span>
            <span><strong>Why these?</strong><small>See recommendation signals</small></span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="product-row">
          {recommendedProducts.map(({ product, reason }) => (
            <ProductCard
              key={product.id}
              product={product}
              reason={reason}
              wished={wishlist.has(product.id)}
              onWish={() => toggleWish(product.id)}
              onOpen={() => openProduct(product)}
            />
          ))}
        </div>
      </section>

      <section className="story-strip">
        <div>
          <span>01</span>
          <p>Starts with real purchase signals</p>
        </div>
        <div>
          <span>02</span>
          <p>Balances affinity with popularity</p>
        </div>
        <div>
          <span>03</span>
          <p>Built to graduate to TIGER</p>
        </div>
        <button type="button" onClick={() => setModelOpen(true)}>Explore the model <span>↗</span></button>
      </section>

      <section className="catalog section-shell" id="catalog">
        <div className="catalog-heading">
          <div>
            <p className="eyebrow">The full collection</p>
            <h2>Shop all</h2>
          </div>
          <p className="result-count">{filteredProducts.length} items</p>
        </div>
        <div className="catalog-tools">
          <div className="filter-scroll" role="group" aria-label="Filter catalog by category">
            {categoryFilters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={category === filter ? "active" : ""}
                aria-pressed={category === filter}
                onClick={() => setCategory(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <label className="inline-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the collection"
              aria-label="Search the collection"
            />
          </label>
        </div>
        <div className="catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wished={wishlist.has(product.id)}
              onWish={() => toggleWish(product.id)}
              onOpen={() => openProduct(product)}
            />
          ))}
        </div>
        {!filteredProducts.length ? (
          <div className="empty-state">
            <h3>No exact match</h3>
            <p>Try another search or browse the full edit.</p>
            <button type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
          </div>
        ) : null}
      </section>

      <footer>
        <div className="footer-mark">H<span>&</span>M <small>RECSYS LAB</small></div>
        <p>A portfolio prototype using the H&M Personalized Fashion Recommendations dataset.</p>
        <div className="footer-links"><a href="#top">Back to top ↑</a><button type="button" onClick={() => setModelOpen(true)}>Model notes</button></div>
      </footer>

      {selected ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close product details">×</button>
            <div className="modal-image"><img src={selected.image} alt={selected.name} /></div>
            <div className="modal-copy">
              <p className="eyebrow">{selected.section}</p>
              <h2 id="product-title">{selected.name}</h2>
              <div className="modal-meta"><span>${selected.price.toFixed(2)}</span><span>{selected.colour}</span></div>
              <p>{selected.description}</p>
              <div className="modal-reason"><span>✦</span><p><strong>Picked for {profile.name}</strong>{recommendations.find((item) => item.product.id === selected.id)?.reason ?? "Popular with shoppers like you"}</p></div>
              <fieldset className="size-picker">
                <legend>Select size</legend>
                <div>{["XS", "S", "M", "L", "XL"].map((size) => <button type="button" key={size} onClick={() => setSelectedSize(size)} className={selectedSize === size ? "active" : ""}>{size}</button>)}</div>
              </fieldset>
              <button className="add-button" type="button" onClick={() => addToBag(selected)}>Add to bag · ${selected.price.toFixed(2)}</button>
              <button className="modal-wish" type="button" onClick={() => toggleWish(selected.id)}>{wishlist.has(selected.id) ? "♥ Saved to favourites" : "♡ Save to favourites"}</button>
            </div>
          </section>
        </div>
      ) : null}

      {modelOpen ? (
        <div className="drawer-backdrop" role="presentation" onMouseDown={() => setModelOpen(false)}>
          <aside className="model-drawer" role="dialog" aria-modal="true" aria-labelledby="model-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setModelOpen(false)} aria-label="Close model details">×</button>
            <p className="eyebrow">Inside your edit</p>
            <h2 id="model-title">A useful baseline,<br />explained plainly.</h2>
            <p className="drawer-intro">The current model scores each item using four signals. It is intentionally simple, deterministic, and replaceable.</p>
            <div className="signal-list">
              <div><span>35%</span><p><strong>Recent popularity</strong>Interactions in the sample transaction window</p></div>
              <div><span>30%</span><p><strong>Category affinity</strong>Similarity to categories in this profile</p></div>
              <div><span>20%</span><p><strong>Colour affinity</strong>A match to preferred colour families</p></div>
              <div><span>15%</span><p><strong>Collection + discovery</strong>Familiar departments with room for novelty</p></div>
            </div>
            <div className="profile-evidence">
              <span>Current profile</span>
              <strong>{profile.name} · {profile.signal}</strong>
              <p>Seeded by: {profile.seedLabel}</p>
            </div>
            <div className="tiger-step">
              <span>Next model milestone</span>
              <strong>TIGER generative retrieval</strong>
              <p>Replace hand-tuned scoring with semantic IDs and autoregressive next-item prediction while keeping this storefront contract unchanged.</p>
            </div>
            <a href="https://arxiv.org/abs/2305.05065" target="_blank" rel="noreferrer">Read the TIGER paper <span>↗</span></a>
          </aside>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
          <button type="button" className="modal-close" onClick={() => setSearchOpen(false)} aria-label="Close search">×</button>
          <div className="search-panel">
            <p className="eyebrow">Find your next favourite</p>
            <label><span aria-hidden="true">⌕</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try ‘black knit’ or ‘denim’" aria-label="Search products" /></label>
            <p>{query ? `${filteredProducts.length} matching items` : "Search by style, colour, or category"}</p>
            {query ? <button type="button" onClick={() => { setSearchOpen(false); document.querySelector('#catalog')?.scrollIntoView(); }}>Show results →</button> : null}
          </div>
        </div>
      ) : null}

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </main>
  );
}

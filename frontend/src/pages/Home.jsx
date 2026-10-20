import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const categories = [
  ["Electronics", "Tech essentials for work and play", "⚡"],
  ["Fashion", "Everyday styles, made simple", "✦"],
  ["Home & Kitchen", "Make your space work better", "⌂"],
  ["Beauty & Personal Care", "Daily care, thoughtfully chosen", "✿"],
  ["Sports & Fitness", "Move better, feel stronger", "◈"],
  ["Books & Stationery", "Ideas, notes and inspiration", "▤"],
];

export default function Home() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryRef = useRef(null);
  const category = params.get("category");
  const q = params.get("q");

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", {
        params: { category: category || "all", q: q || "", limit: 48 },
      })
      .then((r) => setProducts(r.data.items))
      .finally(() => setLoading(false));
  }, [category, q]);

  useEffect(() => {
    if (category && categoryRef.current)
      setTimeout(
        () =>
          categoryRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        120,
      );
  }, [category]);

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">NEXORACART / NEW STANDARD</span>
          <h1>
            Better shopping.
            <br />
            <em>Less friction.</em>
          </h1>
          <p>
            Discover useful products across tech, fashion, home, beauty, fitness
            and books — all in one polished experience.
          </p>
          <div className="hero-actions">
            <a href="#products" className="primary">
              Explore products
            </a>
            <a href="#categories" className="secondary">
              Browse categories
            </a>
          </div>
          <div className="trust">
            <span>✓ Secure checkout</span>
            <span>✓ Curated catalog</span>
            <span>✓ Responsive by design</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-card main-card">
            <span>Featured today</span>
            <strong>
              Smart choices,
              <br />
              made simple.
            </strong>
            <div className="floating-price">
              Up to <b>40%</b>
              <small>selected deals</small>
            </div>
          </div>
          <div className="hero-orb orb-one"></div>
          <div className="hero-orb orb-two"></div>
        </div>
      </section>

      <section id="categories" className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">SHOP BY NEED</span>
            <h2>Explore categories</h2>
          </div>
          <span className="muted">
            Tap a category to jump straight to its products.
          </span>
        </div>
        <div className="category-grid">
          {categories.map(([name, desc, icon]) => (
            <button
              key={name}
              className="category-tile"
              onClick={() => navigate(`/?category=${encodeURIComponent(name)}`)}
            >
              <span className="cat-icon">{icon}</span>
              <div>
                <strong>{name}</strong>
                <p>{desc}</p>
              </div>
              <span>→</span>
            </button>
          ))}
        </div>
      </section>

      <section
        id="products"
        ref={categoryRef}
        className="container section products-section"
      >
        <div className="section-head">
          <div>
            <span className="eyebrow">
              {q
                ? "SEARCH RESULTS"
                : category
                  ? category.toUpperCase()
                  : "CURATED FOR YOU"}
            </span>
            <h2>{q ? `Results for “${q}”` : category || "Popular picks"}</h2>
          </div>
          <span className="muted">{products.length} products</span>
        </div>
        {loading ? (
          <div className="loading">Loading products…</div>
        ) : products.length ? (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>No products found</h3>
            <p>Try another search or clear the filters.</p>
            <a href="/" className="primary">
              Clear search
            </a>
          </div>
        )}
      </section>
    </main>
  );
}

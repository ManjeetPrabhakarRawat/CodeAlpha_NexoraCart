import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useApp } from "../context/AppContext";

export default function Product() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .get(`/products/${id}`)
      .then((r) => {
        if (active) setP(r.data.product);
      })
      .catch((err) => {
        if (active)
          setError(
            err.response?.data?.message || "Product could not be loaded.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading)
    return (
      <main className="container page">
        <div className="loading">Loading product…</div>
      </main>
    );

  if (error || !p) {
    return (
      <main className="container page">
        <div className="empty">
          <h2>Product unavailable</h2>
          <p>{error || "This product could not be found."}</p>
          <Link to="/" className="primary">
            Back to shopping
          </Link>
        </div>
      </main>
    );
  }

  const wished = wishlist.some((x) => x._id === p._id);
  const price = Number(p.price || 0);
  const originalPrice = Number(p.originalPrice || price);

  return (
    <main className="container page">
      <div className="detail">
        <div className="detail-image">
          <img src={p.images?.[0]} alt={p.name} />
        </div>
        <div className="detail-copy">
          <span className="category-label">{p.category}</span>
          <h1>{p.name}</h1>
          <div className="rating">
            <b>★ {Number(p.rating || 0).toFixed(1)}</b>{" "}
            <span>{p.reviewCount || 0} reviews</span>
          </div>
          <p>{p.description}</p>
          <div className="detail-price">
            <strong>₹{price.toLocaleString("en-IN")}</strong>
            <del>₹{originalPrice.toLocaleString("en-IN")}</del>
            <span>{p.discount || 0}% OFF</span>
          </div>
          <div className="stock">
            {p.stock > 0 ? `In stock · ${p.stock} available` : "Out of stock"}
          </div>
          <div className="detail-actions">
            <button
              className="primary"
              disabled={!p.stock}
              onClick={() => addToCart(p)}
            >
              Add to cart
            </button>
            <button className="secondary" onClick={() => toggleWishlist(p)}>
              {wished ? "♥ Saved" : "♡ Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

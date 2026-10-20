import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const wished = wishlist.some((x) => x._id === product._id);
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        <button
          className={wished ? "wish active" : "wish"}
          onClick={() => toggleWishlist(product)}
        >
          {wished ? "♥" : "♡"}
        </button>
        {product.discount > 0 && (
          <span className="discount">{product.discount}% OFF</span>
        )}
      </div>
      <div className="product-info">
        <span className="category-label">{product.category}</span>
        <Link to={`/products/${product._id}`} className="product-name">
          {product.name}
        </Link>
        <div className="rating">
          <b>★ {product.rating}</b>
          <span>({product.reviewCount})</span>
        </div>
        <div className="price-row">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <del>₹{product.originalPrice.toLocaleString("en-IN")}</del>
        </div>
        <button className="add-btn" onClick={() => addToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

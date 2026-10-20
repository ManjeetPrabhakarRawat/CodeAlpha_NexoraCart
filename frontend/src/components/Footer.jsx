import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">N</span>
            <span>
              Nexora<span>Cart</span>
            </span>
          </div>
          <p>Shop smarter. Live better.</p>
          <p className="muted">
            A modern shopping experience built for speed, clarity and trust.
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <Link to="/">Home</Link>
          <Link to="/?deal=1">Deals</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} NexoraCart. All rights reserved.
      </div>
    </footer>
  );
}

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Books & Stationery",
];

function Avatar({ size = "normal" }) {
  return (
    <span
      className={`account-avatar ${size === "large" ? "large" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="3.5" fill="currentColor" />
        <path
          d="M5.5 19c.7-3.3 3.1-5 6.5-5s5.8 1.7 6.5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export default function Header() {
  const { user, cartCount, wishlist, logout } = useApp();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target))
        setAccountOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const q = e.currentTarget.q.value.trim();
    setMenuOpen(false);
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  };

  const chooseCategory = (category) => {
    setMenuOpen(false);
    navigate(`/?category=${encodeURIComponent(category)}`);
  };

  const firstName = user?.name?.trim().split(/\s+/)[0] || "Account";
  const closeAccount = () => setAccountOpen(false);
  const handleLogout = async () => {
    closeAccount();
    await logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="topbar container">
        <Link
          className="brand"
          to="/"
          onClick={() => {
            setMenuOpen(false);
            closeAccount();
          }}
        >
          <span className="brand-mark">N</span>
          <span>
            Nexora<span>Cart</span>
          </span>
        </Link>

        <div className="desktop-search">
          <SearchForm submit={submit} value={params.get("q") || ""} />
        </div>

        <nav className="actions">
          {!isAdmin && (
            <Link to="/wishlist" className="icon-link" aria-label="Wishlist">
              <span className="action-icon">♡</span>
              <small>
                Wishlist <b>{wishlist.length}</b>
              </small>
            </Link>
          )}
          {!isAdmin && (
            <Link to="/cart" className="icon-link" aria-label="Cart">
              <span className="action-icon">🛒</span>
              <small>
                Cart <b>{cartCount}</b>
              </small>
            </Link>
          )}

          {user ? (
            <div className="account account-dropdown" ref={accountRef}>
              <button
                type="button"
                className={`profile-trigger ${accountOpen ? "open" : ""}`}
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <Avatar />
                <span className="profile-trigger-text">
                  <strong>{firstName}</strong>
                  <small>Account</small>
                </span>
              </button>

              {accountOpen && (
                <div className="account-menu-popover" role="menu">
                  <div className="account-menu-head">
                    <Avatar size="large" />
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <div className="account-menu-links">
                    {user.role === "admin" ? (
                      <>
                        <Link
                          to="/admin"
                          onClick={closeAccount}
                          role="menuitem"
                        >
                          <span>▦</span>
                          <div>
                            <strong>Admin Dashboard</strong>
                            <small>Dashboard</small>
                          </div>
                          <b>›</b>
                        </Link>
                        <Link
                          to="/admin/profile"
                          onClick={closeAccount}
                          role="menuitem"
                        >
                          <span>👤</span>
                          <div>
                            <strong>Admin Profile</strong>
                            <small>Account details</small>
                          </div>
                          <b>›</b>
                        </Link>
                        <Link
                          to="/admin/settings"
                          onClick={closeAccount}
                          role="menuitem"
                        >
                          <span>⚙</span>
                          <div>
                            <strong>Settings</strong>
                            <small>Account & security</small>
                          </div>
                          <b>›</b>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          onClick={closeAccount}
                          role="menuitem"
                        >
                          <span>👤</span>
                          <div>
                            <strong>My Profile</strong>
                            <small>Account details</small>
                          </div>
                          <b>›</b>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={closeAccount}
                          role="menuitem"
                        >
                          <span>📦</span>
                          <div>
                            <strong>My Orders</strong>
                            <small>Track purchases</small>
                          </div>
                          <b>›</b>
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={closeAccount}
                          role="menuitem"
                        >
                          <span>♡</span>
                          <div>
                            <strong>Wishlist</strong>
                            <small>{wishlist.length} saved</small>
                          </div>
                          <b>›</b>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={closeAccount}
                          role="menuitem"
                        >
                          <span>⚙</span>
                          <div>
                            <strong>Settings</strong>
                            <small>Account & security</small>
                          </div>
                          <b>›</b>
                        </Link>
                      </>
                    )}
                  </div>
                  <button
                    className="account-logout-menu"
                    onClick={handleLogout}
                  >
                    <span>↪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="login-btn" to="/login">
              Sign in
            </Link>
          )}

          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>

        <div className="mobile-search">
          <SearchForm submit={submit} value={params.get("q") || ""} />
        </div>
      </div>

      <div className={`navrow ${menuOpen ? "mobile-open" : ""}`}>
        <div className="container navscroll">
          <button
            className="navcat"
            onClick={() => {
              setMenuOpen(false);
              navigate("/");
            }}
          >
            Home
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className="navcat"
              onClick={() => chooseCategory(c)}
            >
              {c}
            </button>
          ))}
          <button
            className="navcat deal"
            onClick={() => {
              setMenuOpen(false);
              navigate("/?deal=1");
            }}
          >
            Top Deals
          </button>
        </div>
      </div>
    </header>
  );
}

function SearchForm({ submit, value }) {
  return (
    <form className="search" onSubmit={submit}>
      <span aria-hidden="true">⌕</span>
      <input
        name="q"
        defaultValue={value}
        placeholder="Search products, categories..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

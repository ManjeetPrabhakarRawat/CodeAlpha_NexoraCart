import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import api from "../services/api";

const Avatar = ({ large = false }) => (
  <div
    className={`account-avatar account-avatar-static ${large ? "large" : ""}`}
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" fill="currentColor" />
      <path
        d="M5.5 19c.7-3.3 3.1-5 6.5-5s5.8 1.7 6.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

const UserMenu = ({ active = "profile", wishlist = 0, cart = 0 }) => (
  <div className="account-menu">
    <Link
      to="/profile"
      className={`account-menu-item ${active === "profile" ? "active" : ""}`}
    >
      <span className="account-menu-icon">👤</span>
      <span>My Profile</span>
      <span className="account-arrow">›</span>
    </Link>
    <Link
      to="/orders"
      className={`account-menu-item ${active === "orders" ? "active" : ""}`}
    >
      <span className="account-menu-icon">📦</span>
      <span>My Orders</span>
      <span className="account-arrow">›</span>
    </Link>
    <Link
      to="/wishlist"
      className={`account-menu-item ${active === "wishlist" ? "active" : ""}`}
    >
      <span className="account-menu-icon">♡</span>
      <span>Wishlist</span>
      <b>{wishlist}</b>
      <span className="account-arrow">›</span>
    </Link>
    <Link
      to="/cart"
      className={`account-menu-item ${active === "cart" ? "active" : ""}`}
    >
      <span className="account-menu-icon">🛒</span>
      <span>Cart</span>
      <b>{cart}</b>
      <span className="account-arrow">›</span>
    </Link>
    <Link
      to="/settings"
      className={`account-menu-item ${active === "settings" ? "active" : ""}`}
    >
      <span className="account-menu-icon">⚙</span>
      <span>Settings</span>
      <span className="account-arrow">›</span>
    </Link>
  </div>
);

export const Profile = () => {
  const { user, cartCount, wishlist } = useApp();
  if (!user)
    return (
      <main className="container page">
        <div className="empty">
          <h2>Sign in to view your account</h2>
          <Link className="primary" to="/login">
            Sign in
          </Link>
        </div>
      </main>
    );
  if (user.role === "admin") return <AdminProfile />;

  return (
    <main className="container page account-page">
      <div className="account-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <b>My Account</b>
      </div>
      <div className="account-shell">
        <aside className="account-sidebar">
          <div className="account-user-mini">
            <Avatar />
            <div>
              <span>Hello,</span>
              <strong>{user.name}</strong>
            </div>
          </div>
          <UserMenu wishlist={wishlist.length} cart={cartCount} />
          <LogoutButton />
        </aside>
        <section className="account-content">
          <div className="account-title-row">
            <span className="eyebrow">MY ACCOUNT</span>
            <h1>My Profile</h1>
          </div>
          <div className="account-welcome">
            <div className="welcome-avatar">
              <Avatar large />
            </div>
            <div>
              <span>Welcome back</span>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="account-quick-grid">
            <Link to="/orders" className="quick-card">
              <span className="quick-icon">📦</span>
              <div>
                <strong>My Orders</strong>
                <small>View your orders</small>
              </div>
              <b>›</b>
            </Link>
            <Link to="/wishlist" className="quick-card">
              <span className="quick-icon">♡</span>
              <div>
                <strong>Wishlist</strong>
                <small>{wishlist.length} saved</small>
              </div>
              <b>›</b>
            </Link>
            <Link to="/cart" className="quick-card">
              <span className="quick-icon">🛒</span>
              <div>
                <strong>Cart</strong>
                <small>
                  {cartCount} item{cartCount === 1 ? "" : "s"}
                </small>
              </div>
              <b>›</b>
            </Link>
          </div>
          <section className="profile-info-card account-card">
            <div className="account-section-heading">
              <div>
                <h2>Personal information</h2>
                <p>Account details</p>
              </div>
              <span className="verified-pill">✓ Verified</span>
            </div>
            <div className="profile-info-grid">
              <div>
                <span>Full name</span>
                <strong>{user.name}</strong>
              </div>
              <div>
                <span>Email address</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Account type</span>
                <strong>Customer</strong>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

const AdminProfile = () => {
  const { user } = useApp();
  return (
    <main className="container page account-page admin-account-page">
      <div className="account-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/admin">Admin</Link>
        <span>›</span>
        <b>Profile</b>
      </div>
      <div className="account-shell">
        <aside className="account-sidebar admin-account-sidebar">
          <div className="account-user-mini">
            <Avatar />
            <div>
              <span>Administrator</span>
              <strong>{user.name}</strong>
            </div>
          </div>
          <div className="account-menu">
            <Link to="/admin" className="account-menu-item">
              <span className="account-menu-icon">▦</span>
              <span>Dashboard</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/orders" className="account-menu-item">
              <span className="account-menu-icon">📦</span>
              <span>Orders</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/products" className="account-menu-item">
              <span className="account-menu-icon">□</span>
              <span>Products</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/customers" className="account-menu-item">
              <span className="account-menu-icon">♙</span>
              <span>Customers</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/profile" className="account-menu-item active">
              <span className="account-menu-icon">👤</span>
              <span>Profile</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/settings" className="account-menu-item">
              <span className="account-menu-icon">⚙</span>
              <span>Settings</span>
              <span className="account-arrow">›</span>
            </Link>
          </div>
          <LogoutButton />
        </aside>
        <section className="account-content">
          <div className="account-title-row">
            <span className="eyebrow">ADMIN</span>
            <h1>Profile</h1>
          </div>
          <div className="account-welcome admin-welcome">
            <div className="welcome-avatar">
              <Avatar large />
            </div>
            <div>
              <span>Administrator</span>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>
          <section className="profile-info-card account-card">
            <div className="account-section-heading">
              <div>
                <h2>Account information</h2>
                <p>Administrator account details</p>
              </div>
              <span className="verified-pill">✓ Active</span>
            </div>
            <div className="profile-info-grid">
              <div>
                <span>Full name</span>
                <strong>{user.name}</strong>
              </div>
              <div>
                <span>Email address</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Role</span>
                <strong>Administrator</strong>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
};

const LogoutButton = () => {
  const { logout } = useApp();
  const navigate = useNavigate();
  return (
    <button
      className="account-logout"
      onClick={async () => {
        await logout();
        navigate("/");
      }}
    >
      <span>↪</span> Logout
    </button>
  );
};

export const Settings = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const settingsKey = user ? `nexora_settings_${user.id}` : "nexora_settings";
  const [prefs, setPrefs] = useState({});
  useEffect(() => {
    try {
      setPrefs(JSON.parse(localStorage.getItem(settingsKey) || "{}"));
    } catch {
      setPrefs({});
    }
  }, [settingsKey]);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user)
    return (
      <main className="container page">
        <div className="empty">
          <h2>Sign in to view settings</h2>
          <Link className="primary" to="/login">
            Sign in
          </Link>
        </div>
      </main>
    );
  if (user.role === "admin") return <AdminSettings />;

  const toggle = (key) => {
    const next = { ...prefs, [key]: prefs[key] === false ? true : false };
    setPrefs(next);
    localStorage.setItem(settingsKey, JSON.stringify(next));
    setMessage("Saved");
  };
  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (passwords.newPassword.length < 8)
      return setMessage("New password must be at least 8 characters.");
    if (passwords.newPassword !== passwords.confirmPassword)
      return setMessage("New passwords do not match.");
    setSaving(true);
    try {
      await api.patch("/auth/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage("Password updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };
  const logoutEverywhere = async () => {
    await logout();
    navigate("/");
  };

  return (
    <main className="container page account-page settings-page">
      <div className="account-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/profile">My Account</Link>
        <span>›</span>
        <b>Settings</b>
      </div>
      <div className="account-shell">
        <aside className="account-sidebar">
          <div className="account-user-mini">
            <Avatar />
            <div>
              <span>Hello,</span>
              <strong>{user.name}</strong>
            </div>
          </div>
          <UserMenu active="settings" />
          <button className="account-logout" onClick={logoutEverywhere}>
            <span>↪</span> Logout
          </button>
        </aside>
        <section className="account-content">
          <div className="account-title-row">
            <span className="eyebrow">ACCOUNT</span>
            <h1>Settings</h1>
          </div>
          {message && <div className="settings-notice">{message}</div>}
          <section className="settings-card account-card">
            <div className="settings-card-head">
              <div>
                <h2>Account</h2>
                <p>Your account information</p>
              </div>
              <Link className="secondary" to="/profile">
                View profile
              </Link>
            </div>
            <div className="settings-account-row">
              <Avatar />
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <small>Customer account</small>
              </div>
            </div>
          </section>
          <section className="settings-card account-card">
            <div className="settings-card-head">
              <div>
                <h2>Notifications</h2>
                <p>Choose which updates you receive.</p>
              </div>
            </div>
            <SettingToggle
              title="Order updates"
              description="Order and delivery updates"
              checked={prefs.orderUpdates !== false}
              onChange={() => toggle("orderUpdates")}
            />
            <SettingToggle
              title="Promotional updates"
              description="Deals and offers"
              checked={prefs.promotions === true}
              onChange={() => toggle("promotions")}
            />
            <SettingToggle
              title="Security alerts"
              description="Important account alerts"
              checked={prefs.securityAlerts !== false}
              onChange={() => toggle("securityAlerts")}
            />
          </section>
          <section className="settings-card account-card">
            <div className="settings-card-head">
              <div>
                <h2>Security</h2>
                <p>Change your password.</p>
              </div>
            </div>
            <form className="settings-password-form" onSubmit={changePassword}>
              <label>
                Current password
                <input
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                New password
                <input
                  type="password"
                  required
                  minLength="8"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                  }
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  required
                  minLength="8"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </label>
              <button className="primary" disabled={saving}>
                {saving ? "Updating..." : "Change password"}
              </button>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
};

const AdminSettings = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    if (passwords.newPassword.length < 8)
      return setMessage("New password must be at least 8 characters.");
    if (passwords.newPassword !== passwords.confirmPassword)
      return setMessage("New passwords do not match.");
    setSaving(true);
    try {
      await api.patch("/auth/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage("Password updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };
  const logoutNow = async () => {
    await logout();
    navigate("/");
  };
  return (
    <main className="container page account-page settings-page admin-account-page">
      <div className="account-breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/admin">Admin</Link>
        <span>›</span>
        <b>Settings</b>
      </div>
      <div className="account-shell">
        <aside className="account-sidebar admin-account-sidebar">
          <div className="account-user-mini">
            <Avatar />
            <div>
              <span>Administrator</span>
              <strong>{user.name}</strong>
            </div>
          </div>
          <div className="account-menu">
            <Link to="/admin" className="account-menu-item">
              <span className="account-menu-icon">▦</span>
              <span>Dashboard</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/orders" className="account-menu-item">
              <span className="account-menu-icon">📦</span>
              <span>Orders</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/products" className="account-menu-item">
              <span className="account-menu-icon">□</span>
              <span>Products</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/customers" className="account-menu-item">
              <span className="account-menu-icon">♙</span>
              <span>Customers</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/profile" className="account-menu-item">
              <span className="account-menu-icon">👤</span>
              <span>Profile</span>
              <span className="account-arrow">›</span>
            </Link>
            <Link to="/admin/settings" className="account-menu-item active">
              <span className="account-menu-icon">⚙</span>
              <span>Settings</span>
              <span className="account-arrow">›</span>
            </Link>
          </div>
          <button className="account-logout" onClick={logoutNow}>
            <span>↪</span> Logout
          </button>
        </aside>
        <section className="account-content">
          <div className="account-title-row">
            <span className="eyebrow">ADMIN</span>
            <h1>Settings</h1>
          </div>
          {message && <div className="settings-notice">{message}</div>}
          <section className="settings-card account-card">
            <div className="settings-card-head">
              <div>
                <h2>Administrator account</h2>
                <p>Account and security details</p>
              </div>
              <Link className="secondary" to="/admin/profile">
                View profile
              </Link>
            </div>
            <div className="settings-account-row">
              <Avatar />
              <div>
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <small>Administrator</small>
              </div>
            </div>
          </section>
          <section className="settings-card account-card">
            <div className="settings-card-head">
              <div>
                <h2>Security</h2>
                <p>Change administrator password.</p>
              </div>
            </div>
            <form className="settings-password-form" onSubmit={changePassword}>
              <label>
                Current password
                <input
                  type="password"
                  required
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                New password
                <input
                  type="password"
                  required
                  minLength="8"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                  }
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  required
                  minLength="8"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </label>
              <button className="primary" disabled={saving}>
                {saving ? "Updating..." : "Change password"}
              </button>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
};

function SettingToggle({ title, description, checked, onChange }) {
  return (
    <button type="button" className="setting-toggle" onClick={onChange}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <i className={checked ? "on" : ""}>
        <b />
      </i>
    </button>
  );
}

export const Privacy = () => (
  <main className="container page">
    <span className="eyebrow">LEGAL</span>
    <h1>Privacy</h1>
    <div className="legal">
      <p>See the privacy policy published by the store operator.</p>
    </div>
  </main>
);
export const Terms = () => (
  <main className="container page">
    <span className="eyebrow">LEGAL</span>
    <h1>Terms</h1>
    <div className="legal">
      <p>See the terms published by the store operator.</p>
    </div>
  </main>
);
export const NotFound = () => (
  <main className="container page">
    <div className="empty">
      <h1>Page not found</h1>
      <a className="primary" href="/">
        Back to shopping
      </a>
    </div>
  </main>
);

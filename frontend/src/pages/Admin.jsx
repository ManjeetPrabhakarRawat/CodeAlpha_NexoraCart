import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useApp } from "../context/AppContext";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Books & Stationery",
];
const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  category: "Electronics",
  price: "",
  originalPrice: "",
  discount: "",
  rating: "4.5",
  reviewCount: "0",
  stock: "0",
  images: "",
  featured: false,
};

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const shortId = (id) =>
  `#${String(id || "")
    .slice(-7)
    .toUpperCase()}`;
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function Admin() {
  const { user } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const section = location.pathname.split("/")[2] || "dashboard";

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [savingProduct, setSavingProduct] = useState(false);

  const loadData = async () => {
    if (user?.role !== "admin") return;
    setLoading(true);
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get("/admin/orders"),
        api.get("/admin/users"),
        api.get("/admin/products"),
      ]);
      setOrders(ordersRes.data.orders || []);
      setUsers(usersRes.data.users || []);
      setProducts(productsRes.data.products || []);
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const statusCounts = statuses.reduce(
    (acc, s) => ({
      ...acc,
      [s]: orders.filter((o) => o.orderStatus === s).length,
    }),
    {},
  );

  if (user?.role !== "admin")
    return (
      <main className="container page">
        <div className="empty">
          <h2>Admin access required</h2>
          <p>Only an administrator can open this area.</p>
        </div>
      </main>
    );

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pending = orders.filter((o) => o.orderStatus === "pending").length;
  const delivered = orders.filter((o) => o.orderStatus === "delivered").length;
  const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
  const activeProducts = products.filter((p) => Number(p.stock) > 0).length;
  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.category}`
      .toLowerCase()
      .includes(productSearch.toLowerCase()),
  );
  const filteredOrders = orders.filter((o) =>
    `${o._id} ${o.user?.name || ""} ${o.user?.email || ""} ${o.orderStatus}`
      .toLowerCase()
      .includes(orderSearch.toLowerCase()),
  );
  const filteredUsers = users
    .filter((u) => u.role === "customer")
    .filter((u) =>
      `${u.name} ${u.email}`
        .toLowerCase()
        .includes(customerSearch.toLowerCase()),
    );

  const go = (path) => navigate(`/admin${path ? `/${path}` : ""}`);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)),
      );
      setNotice("Order status updated successfully.");
    } catch (err) {
      setNotice(
        err.response?.data?.message || "Unable to update order status.",
      );
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.description.trim()) {
      setNotice("Product name and description are required.");
      return;
    }
    if (
      !Number.isFinite(Number(productForm.price)) ||
      Number(productForm.price) < 0
    ) {
      setNotice("Enter a valid product price.");
      return;
    }
    setSavingProduct(true);
    try {
      const payload = {
        ...productForm,
        slug:
          productForm.slug ||
          productForm.name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-"),
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        discount: Number(productForm.discount || 0),
        rating: Number(productForm.rating || 0),
        reviewCount: Number(productForm.reviewCount || 0),
        stock: Number(productForm.stock || 0),
        images: String(productForm.images || "")
          .split(/\s*,\s*|\n/)
          .map((x) => x.trim())
          .filter(Boolean),
      };
      if (editingProduct) {
        const r = await api.put(
          `/admin/products/${editingProduct._id}`,
          payload,
        );
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? r.data.product : p)),
        );
        setNotice("Product updated successfully.");
      } else {
        const r = await api.post("/admin/products", payload);
        setProducts((prev) => [r.data.product, ...prev]);
        setNotice("Product added successfully.");
      }
      setEditingProduct(null);
      setProductForm(emptyProduct);
    } catch (err) {
      setNotice(
        err.response?.data?.message ||
          "Unable to save product. Please try again.",
      );
    } finally {
      setSavingProduct(false);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product, images: (product.images || []).join(", ") });
    go("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try {
      await api.delete(`/admin/products/${product._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      setNotice("Product deleted successfully.");
    } catch (err) {
      setNotice(err.response?.data?.message || "Unable to delete product.");
    }
  };

  return (
    <main className="admin-page-wrap">
      <div className="admin-shell container">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="brand-mark">N</span>
            <div>
              <strong>Admin</strong>
            </div>
          </div>
          <div className="admin-profile">
            <div className="admin-avatar">
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
            <div>
              <strong>{user.name}</strong>
              <small>Administrator</small>
            </div>
          </div>
          <nav className="admin-nav">
            <button
              className={section === "dashboard" ? "active" : ""}
              onClick={() => go("")}
            >
              <span>▦</span> Dashboard
            </button>
            <button
              className={section === "orders" ? "active" : ""}
              onClick={() => go("orders")}
            >
              <span>▤</span> Orders <b>{pending || ""}</b>
            </button>
            <button
              className={section === "products" ? "active" : ""}
              onClick={() => go("products")}
            >
              <span>□</span> Products
            </button>
            <button
              className={section === "customers" ? "active" : ""}
              onClick={() => go("customers")}
            >
              <span>♙</span> Customers
            </button>
            <button
              className={section === "profile" ? "active" : ""}
              onClick={() => go("profile")}
            >
              <span>👤</span> Profile
            </button>
            <button
              className={section === "settings" ? "active" : ""}
              onClick={() => go("settings")}
            >
              <span>⚙</span> Settings
            </button>
          </nav>
          <div className="admin-side-bottom">
            <Link to="/">← Store</Link>
          </div>
        </aside>

        <section className="admin-main">
          <header className="admin-topbar">
            <div>
              <h1>
                {section === "dashboard"
                  ? "Dashboard"
                  : section[0].toUpperCase() + section.slice(1)}
              </h1>
            </div>
            <Link to="/" className="admin-store-link">
              View store
            </Link>
          </header>
          {notice && (
            <div className="admin-notice">
              {notice}
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}
          {loading ? (
            <div className="admin-loading">Loading dashboard…</div>
          ) : (
            <>
              {section === "dashboard" && (
                <Dashboard
                  orders={orders}
                  products={products}
                  users={users.filter((u) => u.role === "customer")}
                  totalRevenue={totalRevenue}
                  pending={pending}
                  delivered={delivered}
                  lowStock={lowStock}
                  activeProducts={activeProducts}
                  statusCounts={statusCounts}
                  money={money}
                  formatDate={formatDate}
                  go={go}
                />
              )}
              {section === "orders" && (
                <OrdersView
                  orders={filteredOrders}
                  search={orderSearch}
                  setSearch={setOrderSearch}
                  updateStatus={updateStatus}
                  money={money}
                  shortId={shortId}
                  formatDate={formatDate}
                />
              )}
              {section === "products" && (
                <ProductsView
                  products={filteredProducts}
                  search={productSearch}
                  setSearch={setProductSearch}
                  form={productForm}
                  setForm={setProductForm}
                  editing={editingProduct}
                  setEditing={setEditingProduct}
                  save={saveProduct}
                  edit={editProduct}
                  remove={deleteProduct}
                  money={money}
                  savingProduct={savingProduct}
                />
              )}
              {section === "customers" && (
                <CustomersView
                  users={filteredUsers}
                  search={customerSearch}
                  setSearch={setCustomerSearch}
                  formatDate={formatDate}
                />
              )}
              {section === "profile" && <AdminProfileView user={user} />}
              {section === "settings" && <AdminSettingsView user={user} />}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function AdminProfileView({ user }) {
  return (
    <section className="admin-card admin-profile-page">
      <div className="admin-profile-hero">
        <div className="admin-avatar large">
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
        <div>
          <span>Administrator</span>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="admin-settings-grid">
        <div>
          <span>Full name</span>
          <strong>{user.name}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
        <div>
          <span>Role</span>
          <strong>Administrator</strong>
        </div>
      </div>
      <Link
        className="admin-primary-btn admin-settings-link"
        to="/admin/settings"
      >
        Open settings
      </Link>
    </section>
  );
}

function AdminSettingsView({ user }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
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
  return (
    <div className="admin-settings-stack">
      {message && (
        <div className="admin-notice">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}
      <section className="admin-card admin-settings-panel">
        <div className="admin-card-heading">
          <div>
            <h2>Account</h2>
            <p>Administrator account details</p>
          </div>
          <Link className="admin-text-link" to="/admin/profile">
            View profile
          </Link>
        </div>
        <div className="admin-settings-grid">
          <div>
            <span>Administrator</span>
            <strong>{user.name}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>Administrator</strong>
          </div>
        </div>
      </section>
      <section className="admin-card admin-settings-panel">
        <div className="admin-card-heading">
          <div>
            <h2>Security</h2>
            <p>Change the administrator password.</p>
          </div>
        </div>
        <form className="admin-password-form" onSubmit={changePassword}>
          <label>
            Current password
            <input
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
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
                setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
              }
            />
          </label>
          <button className="admin-primary-btn" disabled={saving}>
            {saving ? "Updating..." : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Dashboard({
  orders,
  products,
  users,
  totalRevenue,
  pending,
  delivered,
  lowStock,
  activeProducts,
  statusCounts,
  money,
  formatDate,
  go,
}) {
  const max = Math.max(...Object.values(statusCounts), 1);
  return (
    <>
      <div className="admin-kpi-grid">
        <div className="admin-kpi">
          <span className="kpi-icon purple">₹</span>
          <div>
            <small>Total sales</small>
            <strong>{money(totalRevenue)}</strong>
            <em>Across {orders.length} orders</em>
          </div>
        </div>
        <div className="admin-kpi">
          <span className="kpi-icon blue">▤</span>
          <div>
            <small>Total orders</small>
            <strong>{orders.length}</strong>
            <em>{pending} pending</em>
          </div>
        </div>
        <div className="admin-kpi">
          <span className="kpi-icon green">□</span>
          <div>
            <small>Products</small>
            <strong>{products.length}</strong>
            <em>{activeProducts} in stock</em>
          </div>
        </div>
        <div className="admin-kpi">
          <span className="kpi-icon orange">♙</span>
          <div>
            <small>Customers</small>
            <strong>{users.length}</strong>
            <em>{delivered} delivered orders</em>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-card admin-sales-card">
          <div className="admin-card-heading">
            <div>
              <h2>Orders</h2>
              <p>Order status</p>
            </div>
            <button onClick={() => go("orders")}>View all</button>
          </div>
          <div className="status-bars">
            {[
              "pending",
              "confirmed",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ].map((s) => (
              <div className="status-bar-row" key={s}>
                <span>{s}</span>
                <div>
                  <i style={{ width: `${(statusCounts[s] / max) * 100}%` }} />
                </div>
                <b>{statusCounts[s]}</b>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-card admin-quick-card">
          <div className="admin-card-heading">
            <div>
              <h2>Quick actions</h2>
            </div>
          </div>
          <div className="quick-admin-actions">
            <button onClick={() => go("products")}>＋ Add product</button>
            <button onClick={() => go("orders")}>▤ Manage orders</button>
            <button onClick={() => go("customers")}>♙ View customers</button>
          </div>
          <div className="low-stock">
            <span>⚠</span>
            <div>
              <strong>{lowStock} low-stock products</strong>
              <small>Inventory needs attention.</small>
            </div>
          </div>
        </section>
      </div>

      <section className="admin-card admin-table-card">
        <div className="admin-card-heading">
          <div>
            <h2>Recent orders</h2>
          </div>
          <button onClick={() => go("orders")}>View all orders →</button>
        </div>
        <OrderTable
          orders={orders.slice(0, 7)}
          updateStatus={null}
          money={money}
          shortId={shortId}
          formatDate={formatDate}
        />
      </section>
    </>
  );
}

function OrderTable({ orders, updateStatus, money, shortId, formatDate }) {
  if (!orders.length) return <div className="admin-empty">No orders yet.</div>;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            {updateStatus && <th>Update</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td>
                <strong>{shortId(o._id)}</strong>
              </td>
              <td>
                <strong>{o.user?.name || "Customer"}</strong>
                <small>{o.user?.email || "—"}</small>
              </td>
              <td>{formatDate(o.createdAt)}</td>
              <td>
                <strong>{money(o.total)}</strong>
              </td>
              <td>
                <span className={`admin-status ${o.orderStatus}`}>
                  {o.orderStatus}
                </span>
              </td>
              {updateStatus && (
                <td>
                  <select
                    value={o.orderStatus}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersView({
  orders,
  search,
  setSearch,
  updateStatus,
  money,
  shortId,
  formatDate,
}) {
  return (
    <section className="admin-card admin-table-card">
      <div className="admin-card-heading">
        <div>
          <h2>Orders</h2>
        </div>
        <input
          className="admin-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
        />
      </div>
      <OrderTable
        orders={orders}
        updateStatus={updateStatus}
        money={money}
        shortId={shortId}
        formatDate={formatDate}
      />
    </section>
  );
}

function ProductsView({
  products,
  search,
  setSearch,
  form,
  setForm,
  editing,
  setEditing,
  save,
  edit,
  remove,
  money,
  savingProduct,
}) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  return (
    <>
      <section className="admin-card product-editor">
        <div className="admin-card-heading">
          <div>
            <h2>{editing ? "Edit product" : "Add new product"}</h2>
            <p>Create and maintain your shopping catalog.</p>
          </div>
          {editing && (
            <button
              className="cancel-edit"
              onClick={() => {
                setEditing(null);
                setForm(emptyProduct);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
        <form className="admin-product-form" onSubmit={save}>
          <label>
            Product name
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Wireless Headphones"
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Price
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </label>
          <label>
            Original price
            <input
              type="number"
              min="0"
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </label>
          <label>
            Discount %
            <input
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) => set("discount", e.target.value)}
            />
          </label>
          <label className="wide">
            Image URL(s)
            <textarea
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              placeholder="https://... (separate multiple URLs with commas)"
            />
          </label>
          <label className="wide">
            Description
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Product description"
            />
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />{" "}
            Featured product
          </label>
          <button
            className="admin-primary-btn"
            type="submit"
            disabled={savingProduct}
          >
            {savingProduct
              ? "Saving..."
              : editing
                ? "Save changes"
                : "Add product"}
          </button>
        </form>
      </section>
      <section className="admin-card admin-table-card">
        <div className="admin-card-heading">
          <div>
            <h2>Product catalog</h2>
            <p>Manage price, stock and product details.</p>
          </div>
          <input
            className="admin-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="admin-product-cell">
                      <img src={p.images?.[0]} alt="" />
                      <div>
                        <strong>{p.name}</strong>
                        <small>{p.featured ? "Featured" : "Standard"}</small>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>
                    <strong>{money(p.price)}</strong>
                  </td>
                  <td>
                    <span
                      className={
                        Number(p.stock) <= 5 ? "stock-low" : "stock-ok"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td>★ {Number(p.rating || 0).toFixed(1)}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => edit(p)}>Edit</button>
                      <button className="danger" onClick={() => remove(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function CustomersView({ users, search, setSearch, formatDate }) {
  return (
    <section className="admin-card admin-table-card">
      <div className="admin-card-heading">
        <div>
          <h2>Customers</h2>
        </div>
        <input
          className="admin-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
        />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="customer-cell">
                    <span className="customer-avatar">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="3.5" fill="currentColor" />
                        <path
                          d="M5.5 19c.7-3.3 3.1-5 6.5-5s5.8 1.7 6.5 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-pill ${u.role}`}>{u.role}</span>
                </td>
                <td>{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

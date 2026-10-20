import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppProvider, { useApp } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Product from "./pages/Product";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Admin from "./pages/Admin";
import {
  Profile,
  Settings,
  Privacy,
  Terms,
  NotFound,
} from "./pages/SimplePages";

function RouteLoading() {
  return (
    <main className="container page">
      <div className="loading">Loading account…</div>
    </main>
  );
}

function RequireCustomer({ children }) {
  const { user, authReady } = useApp();
  if (!authReady) return <RouteLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, authReady } = useApp();
  if (!authReady) return <RouteLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  return (
    <main className="container page">
      <span className="eyebrow">SAVED ITEMS</span>
      <h1>Wishlist</h1>
      {wishlist.length ? (
        <div className="product-grid">
          {wishlist.map((p) => (
            <div className="product-card" key={p._id}>
              <div className="product-image">
                <img src={p.images?.[0]} alt={p.name} />
              </div>
              <div className="product-info">
                <span className="category-label">{p.category}</span>
                <h3 className="product-name">{p.name}</h3>
                <div className="price-row">
                  <strong>₹{p.price.toLocaleString("en-IN")}</strong>
                </div>
                <button className="add-btn" onClick={() => addToCart(p)}>
                  Add to cart
                </button>
                <button className="text-btn" onClick={() => toggleWishlist(p)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>No saved products</h3>
          <a href="/" className="primary">
            Browse products
          </a>
        </div>
      )}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/products/:id" element={<Product />} />
          <Route
            path="/cart"
            element={
              <RequireCustomer>
                <Cart />
              </RequireCustomer>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireCustomer>
                <Checkout />
              </RequireCustomer>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireCustomer>
                <Orders />
              </RequireCustomer>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <RequireCustomer>
                <OrderDetail />
              </RequireCustomer>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireCustomer>
                <Wishlist />
              </RequireCustomer>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireCustomer>
                <Profile />
              </RequireCustomer>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireCustomer>
                <Settings />
              </RequireCustomer>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AppProvider>
    </BrowserRouter>
  );
}

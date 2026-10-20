import { useState } from "react";
import { useApp } from "../context/AppContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
export default function Checkout() {
  const { cart, cartTotal, user, updateQty } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!user)
    return (
      <main className="container page">
        <div className="empty">
          <h3>Sign in to checkout</h3>
          <button className="primary" onClick={() => nav("/login")}>
            Sign in
          </button>
        </div>
      </main>
    );
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await api.post("/orders", {
        items: cart.map((x) => ({
          productId: x.productId,
          quantity: x.quantity,
        })),
        shippingAddress: form,
        paymentMethod: "cod",
      });
      localStorage.setItem("nexora_cart", "[]");
      window.location.href = `/orders/${r.data.order._id}`;
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="container page">
      <div className="section-head">
        <div>
          <span className="eyebrow">CHECKOUT</span>
          <h1>Complete your order</h1>
        </div>
      </div>
      <div className="checkout-layout">
        <form className="form-card" onSubmit={submit}>
          <h2>Shipping details</h2>
          {["name", "phone", "address", "city", "state", "pincode"].map((k) => (
            <label key={k}>
              {k[0].toUpperCase() + k.slice(1)}
              <input
                required
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
          {error && <div className="error">{error}</div>}
          <button className="primary full" disabled={busy}>
            {busy
              ? "Placing order…"
              : "Place order · ₹" + cartTotal.toLocaleString("en-IN")}
          </button>
        </form>
        <aside className="summary">
          <span className="eyebrow">ORDER SUMMARY</span>
          <div>
            <span>Items</span>
            <b>{cart.reduce((s, x) => s + x.quantity, 0)}</b>
          </div>
          <div>
            <span>Subtotal</span>
            <b>₹{cartTotal.toLocaleString("en-IN")}</b>
          </div>
          <div>
            <span>Payment</span>
            <b>Cash on delivery</b>
          </div>
          <hr />
          <div className="total">
            <span>Total</span>
            <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

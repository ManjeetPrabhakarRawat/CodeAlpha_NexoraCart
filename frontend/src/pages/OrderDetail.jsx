import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const statuses = ["pending", "confirmed", "processing", "shipped", "delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/orders/${id}`)
      .then((r) => active && setOrder(r.data.order))
      .catch(
        (err) =>
          active &&
          setError(err.response?.data?.message || "Unable to load this order."),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const cancelOrder = async () => {
    if (!order || !["pending", "confirmed"].includes(order.orderStatus)) return;
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const r = await api.patch(`/orders/${id}/cancel`);
      setOrder(r.data.order);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel this order.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading)
    return (
      <main className="container page">
        <div className="loading">Loading order…</div>
      </main>
    );
  if (!order)
    return (
      <main className="container page">
        <div className="empty">
          <h3>Order not found</h3>
          <p>{error || "This order is no longer available."}</p>
          <Link className="primary" to="/orders">
            Back to orders
          </Link>
        </div>
      </main>
    );

  const activeIndex = statuses.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <main className="container page order-detail-page">
      <div className="order-detail-top">
        <Link className="back-link" to="/orders">
          ← Your orders
        </Link>
        <div className="order-heading">
          <div>
            <span className="eyebrow">ORDER DETAILS</span>
            <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p>
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="order-heading-actions">
            <span className={`status large status-${order.orderStatus}`}>
              {order.orderStatus}
            </span>
            {["pending", "confirmed"].includes(order.orderStatus) && (
              <button
                className="secondary-action danger"
                onClick={cancelOrder}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling…" : "Cancel order"}
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error order-error">{error}</div>}

      {!isCancelled && (
        <section className="order-progress card-surface">
          <div className="order-progress-head">
            <h2>Delivery status</h2>
            <span>{order.orderStatus}</span>
          </div>
          <div className="progress-track">
            {statuses.map((status, index) => (
              <div
                className={`progress-step ${index <= activeIndex ? "done" : ""}`}
                key={status}
              >
                <span className="progress-dot">
                  {index < activeIndex ? "✓" : index === activeIndex ? "•" : ""}
                </span>
                <b>{status[0].toUpperCase() + status.slice(1)}</b>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="order-detail-grid">
        <section className="card-surface order-items-panel">
          <div className="panel-heading">
            <h2>Items in this order</h2>
            <span>
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <div className="order-detail-items">
            {order.items.map((item) => (
              <div
                className="order-detail-item"
                key={`${item.product}-${item.name}`}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="order-image-fallback">N</div>
                )}
                <div className="order-detail-item-info">
                  <strong>{item.name}</strong>
                  <span>Quantity: {item.quantity}</span>
                  <span>Price: {money(item.price)} each</span>
                </div>
                <b>{money(item.price * item.quantity)}</b>
              </div>
            ))}
          </div>
        </section>

        <aside className="order-side-column">
          <section className="card-surface order-info-card">
            <h2>Price details</h2>
            <div>
              <span>Subtotal</span>
              <b>{money(order.subtotal)}</b>
            </div>
            <div>
              <span>Discount</span>
              <b className="discount-value">− {money(order.discount)}</b>
            </div>
            <hr />
            <div className="order-total-row">
              <strong>Total</strong>
              <strong>{money(order.total)}</strong>
            </div>
            <div className="payment-row">
              <span>Payment</span>
              <b>
                {order.paymentMethod === "cod"
                  ? "Cash on delivery"
                  : "Online payment"}
              </b>
            </div>
            <div className="payment-row">
              <span>Payment status</span>
              <b>{order.paymentStatus}</b>
            </div>
          </section>

          <section className="card-surface address-card">
            <h2>Delivery address</h2>
            <strong>{order.shippingAddress?.name}</strong>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} —{" "}
              {order.shippingAddress?.pincode}
            </p>
            <p>Phone: {order.shippingAddress?.phone}</p>
          </section>
        </aside>
      </div>

      <div className="order-footer-actions">
        <Link className="orders-back-link" to="/orders">
          ← Back to orders
        </Link>
        <button
          className="secondary-action continue-shopping-btn"
          onClick={() => navigate("/")}
        >
          Continue shopping
        </button>
      </div>
    </main>
  );
}

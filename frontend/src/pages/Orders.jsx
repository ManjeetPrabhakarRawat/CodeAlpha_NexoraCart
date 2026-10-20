import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/orders")
      .then((r) => active && setOrders(r.data.orders || []))
      .catch(() => active && setOrders([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="container page">
        <div className="loading">Loading your orders…</div>
      </main>
    );
  }

  return (
    <main className="container page">
      <div className="section-head">
        <div>
          <span className="eyebrow">ACCOUNT</span>
          <h1>Your orders</h1>
        </div>
        {orders.length > 0 && (
          <span className="muted">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {orders.length ? (
        <div className="orders">
          {orders.map((order) => {
            const first = order.items?.[0];
            const itemCount =
              order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            return (
              <Link
                className="order-card order-card-rich"
                to={`/orders/${order._id}`}
                key={order._id}
              >
                <div className="order-product-preview">
                  {first?.image ? (
                    <img src={first.image} alt={first.name} />
                  ) : (
                    <div className="order-image-fallback">N</div>
                  )}
                  <div className="order-product-info">
                    <strong>{first?.name || "Order items"}</strong>
                    {order.items?.length > 1 && (
                      <span>
                        + {order.items.length - 1} more item
                        {order.items.length > 2 ? "s" : ""}
                      </span>
                    )}
                    <span>
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <div className="order-meta">
                  <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className={`status status-${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="order-total">
                  <b>{money(order.total)}</b>
                  <span>View details →</span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          <h3>No orders yet</h3>
          <p>Your placed orders will appear here.</p>
          <Link className="primary" to="/">
            Shop now
          </Link>
        </div>
      )}
    </main>
  );
}

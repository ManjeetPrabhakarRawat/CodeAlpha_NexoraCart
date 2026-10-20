import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
export default function Cart() {
  const { cart, updateQty, removeCart, cartTotal } = useApp();
  const nav = useNavigate();
  return (
    <main className="container page">
      <div className="section-head">
        <div>
          <span className="eyebrow">YOUR BAG</span>
          <h1>Shopping cart</h1>
        </div>
      </div>
      {!cart.length ? (
        <div className="empty">
          <h3>Your cart is empty</h3>
          <p>Add something you like and it will appear here.</p>
          <Link className="primary" to="/">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((i) => (
              <div className="cart-item" key={i.productId}>
                <img src={i.image} alt="" />
                <div className="cart-meta">
                  <h3>{i.name}</h3>
                  <span>₹{i.price.toLocaleString("en-IN")}</span>
                  <div className="qty">
                    <button
                      onClick={() => updateQty(i.productId, i.quantity - 1)}
                    >
                      -
                    </button>
                    <b>{i.quantity}</b>
                    <button
                      onClick={() => updateQty(i.productId, i.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove"
                  onClick={() => removeCart(i.productId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <aside className="summary">
            <span className="eyebrow">ORDER SUMMARY</span>
            <div>
              <span>Subtotal</span>
              <b>₹{cartTotal.toLocaleString("en-IN")}</b>
            </div>
            <div>
              <span>Discount</span>
              <b>—</b>
            </div>
            <hr />
            <div className="total">
              <span>Total</span>
              <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
            </div>
            <button className="primary full" onClick={() => nav("/checkout")}>
              Continue to checkout
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

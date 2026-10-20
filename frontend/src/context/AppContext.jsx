import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const storageKey = (type, userId) => `nexora_${type}_${userId}`;

const readUserState = (userId) => {
  if (!userId) return { cart: [], wishlist: [] };
  try {
    return {
      cart: JSON.parse(
        localStorage.getItem(storageKey("cart", userId)) || "[]",
      ),
      wishlist: JSON.parse(
        localStorage.getItem(storageKey("wishlist", userId)) || "[]",
      ),
    };
  } catch {
    return { cart: [], wishlist: [] };
  }
};

const writeUserState = (userId, cart, wishlist) => {
  if (!userId) return;
  localStorage.setItem(storageKey("cart", userId), JSON.stringify(cart));
  localStorage.setItem(
    storageKey("wishlist", userId),
    JSON.stringify(wishlist),
  );
};

const clearLegacySharedState = () => {
  // Remove the old shared keys so data from the previous implementation
  // cannot leak into another account.
  localStorage.removeItem("nexora_cart");
  localStorage.removeItem("nexora_wishlist");
};

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const loadUserState = (nextUser) => {
    clearLegacySharedState();
    if (!nextUser || nextUser.role === "admin") {
      setCart([]);
      setWishlist([]);
      return;
    }
    const state = readUserState(nextUser.id);
    setCart(state.cart);
    setWishlist(state.wishlist);
  };

  useEffect(() => {
    let active = true;
    Promise.all([api.get("/auth/me"), api.get("/auth/csrf").catch(() => null)])
      .then(([me]) => {
        if (!active) return;
        const nextUser = me?.data?.user || null;
        setUser(nextUser);
        loadUserState(nextUser);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        loadUserState(null);
      })
      .finally(() => {
        if (active) setAuthReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    writeUserState(user.id, cart, wishlist);
  }, [user, cart, wishlist]);

  const addToCart = (product, quantity = 1) => {
    if (!user || user.role === "admin") return;
    setCart((prev) => {
      const existing = prev.find((x) => x.productId === product._id);
      if (existing)
        return prev.map((x) =>
          x.productId === product._id
            ? { ...x, quantity: Math.min(x.quantity + quantity, 20) }
            : x,
        );
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          quantity,
        },
      ];
    });
  };

  const updateQty = (id, quantity) => {
    if (!user || user.role === "admin") return;
    setCart((prev) =>
      prev.map((x) =>
        x.productId === id
          ? { ...x, quantity: Math.max(1, Math.min(20, quantity)) }
          : x,
      ),
    );
  };

  const removeCart = (id) => {
    if (!user || user.role === "admin") return;
    setCart((prev) => prev.filter((x) => x.productId !== id));
  };

  const toggleWishlist = (p) => {
    if (!user || user.role === "admin") return;
    setWishlist((prev) =>
      prev.some((x) => x._id === p._id)
        ? prev.filter((x) => x._id !== p._id)
        : [...prev, p],
    );
  };

  const login = async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    const nextUser = r.data.user;
    setUser(nextUser);
    loadUserState(nextUser);
    return r.data;
  };

  const register = async (name, email, password) => {
    const r = await api.post("/auth/register", { name, email, password });
    const nextUser = r.data.user;
    setUser(nextUser);
    loadUserState(nextUser);
    return r.data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setCart([]);
      setWishlist([]);
      clearLegacySharedState();
    }
  };

  const value = useMemo(
    () => ({
      user,
      authReady,
      cart,
      wishlist,
      addToCart,
      updateQty,
      removeCart,
      toggleWishlist,
      login,
      register,
      logout,
      cartCount: cart.reduce((s, x) => s + x.quantity, 0),
      cartTotal: cart.reduce((s, x) => s + x.price * x.quantity, 0),
    }),
    [user, authReady, cart, wishlist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

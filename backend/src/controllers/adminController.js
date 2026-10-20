import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const adminOrders = async (req, res) => {
  // Admin order management contains customer orders only. Admin accounts
  // are never customer accounts and must not appear in the customer order list.
  const customerIds = await User.find({ role: "customer" })
    .select("_id")
    .lean();
  const orders = await Order.find({
    user: { $in: customerIds.map((x) => x._id) },
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  res.json({ success: true, orders });
};

export const updateOrderStatus = async (req, res) => {
  const allowed = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!allowed.includes(req.body.status))
    return res
      .status(400)
      .json({ success: false, message: "Invalid order status" });
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: req.body.status },
    { new: true },
  );
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order });
};

export const adminUsers = async (req, res) => {
  // The customer management view must never expose administrator accounts.
  const users = await User.find({ role: "customer" })
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();
  res.json({ success: true, users });
};

export const adminProducts = async (req, res) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(1000)
    .lean();
  res.json({ success: true, products });
};

export const adminStats = async (req, res) => {
  const customerIds = await User.find({ role: "customer" })
    .select("_id")
    .lean();
  const ids = customerIds.map((x) => x._id);
  const [products, users, orders] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.countDocuments({ user: { $in: ids } }),
  ]);
  const sales = await Order.aggregate([
    { $match: { user: { $in: ids }, orderStatus: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);
  res.json({
    success: true,
    stats: { products, users, orders, revenue: sales[0]?.total || 0 },
  });
};

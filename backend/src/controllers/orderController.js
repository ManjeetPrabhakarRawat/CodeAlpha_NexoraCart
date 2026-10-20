import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod = "cod" } = req.body;
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ success: false, message: "Cart is empty" });
  if (
    !shippingAddress?.name ||
    !shippingAddress?.phone ||
    !shippingAddress?.address ||
    !shippingAddress?.city ||
    !shippingAddress?.state ||
    !shippingAddress?.pincode
  )
    return res
      .status(400)
      .json({
        success: false,
        message: "Complete shipping address is required",
      });

  const session = await mongoose.startSession();
  try {
    let created;
    await session.withTransaction(async () => {
      const ids = items.map((x) => x.productId);
      if (ids.some((id) => !mongoose.isValidObjectId(id)))
        throw new Error("Invalid product id");

      const products = await Product.find({ _id: { $in: ids } }).session(
        session,
      );
      const map = new Map(products.map((p) => [p._id.toString(), p]));
      const orderItems = [];
      let subtotal = 0;

      for (const raw of items) {
        const qty = Number(raw.quantity);
        const product = map.get(String(raw.productId));
        if (!product || !Number.isInteger(qty) || qty < 1 || qty > 20)
          throw new Error("Invalid cart item");
        if (product.stock < qty)
          throw new Error(`Insufficient stock for ${product.name}`);

        // Server-side price: never trust the browser price.
        subtotal += product.price * qty;
        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.images?.[0],
        });
      }

      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session },
        );
        if (!updated)
          throw new Error("Stock changed. Please review your cart.");
      }

      const discount = subtotal >= 5000 ? Math.round(subtotal * 0.05) : 0;
      created = await Order.create(
        [
          {
            user: req.user.sub,
            items: orderItems,
            shippingAddress,
            subtotal,
            discount,
            total: subtotal - discount,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending",
          },
        ],
        { session },
      );
      created = created[0];
    });
    res.status(201).json({ success: true, order: created });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  } finally {
    await session.endSession();
  }
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.sub })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json({ success: true, orders });
};

export const getOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.sub,
  }).lean();
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order });
};

export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    let updated;
    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user.sub,
      }).session(session);
      if (!order) throw new Error("Order not found");
      if (!["pending", "confirmed"].includes(order.orderStatus))
        throw new Error("This order can no longer be cancelled");

      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
        ).session(session);
      }
      order.orderStatus = "cancelled";
      updated = await order.save({ session });
    });
    res.json({ success: true, order: updated });
  } catch (err) {
    const status = err.message === "Order not found" ? 404 : 400;
    res.status(status).json({ success: false, message: err.message });
  } finally {
    await session.endSession();
  }
};

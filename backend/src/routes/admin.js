import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  adminOrders,
  updateOrderStatus,
  adminUsers,
  adminProducts,
  adminStats,
} from "../controllers/adminController.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { validateObjectId } from "../middleware/security.js";

const r = Router();
r.use(requireAuth, requireAdmin);
r.get("/stats", adminStats);
r.get("/orders", adminOrders);
r.get("/products", adminProducts);
r.patch("/orders/:id/status", validateObjectId, updateOrderStatus);
r.get("/users", adminUsers);
r.post("/products", createProduct);
r.put("/products/:id", validateObjectId, updateProduct);
r.delete("/products/:id", validateObjectId, deleteProduct);
export default r;

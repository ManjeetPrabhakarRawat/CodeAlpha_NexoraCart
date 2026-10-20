import { Router } from "express";
import {
  createOrder,
  myOrders,
  getOrder,
  cancelOrder,
} from "../controllers/orderController.js";
import { requireAuth, requireCustomer } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/security.js";
const r = Router();
r.use(requireAuth, requireCustomer);
r.post("/", createOrder);
r.get("/", myOrders);
r.get("/:id", validateObjectId, getOrder);
r.patch("/:id/cancel", validateObjectId, cancelOrder);
export default r;

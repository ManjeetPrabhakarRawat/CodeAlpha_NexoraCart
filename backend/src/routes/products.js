import { Router } from "express";
import {
  listProducts,
  getProduct,
  categoryProducts,
} from "../controllers/productController.js";
import { validateObjectId } from "../middleware/security.js";
const r = Router();
r.get("/", listProducts);
r.get("/category/:category", categoryProducts);
r.get("/:id", validateObjectId, getProduct);
export default r;

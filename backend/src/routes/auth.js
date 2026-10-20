import { Router } from "express";
import {
  register,
  login,
  logout,
  me,
  csrf,
  changePassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.post("/register", register);
r.post("/login", login);
r.post("/logout", logout);
r.patch("/password", requireAuth, changePassword);
r.get("/me", requireAuth, me);
r.get("/csrf", csrf);
export default r;

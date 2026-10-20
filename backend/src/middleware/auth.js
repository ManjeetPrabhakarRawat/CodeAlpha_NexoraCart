import { verifyToken } from "../utils/jwt.js";

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    req.user = verifyToken(token);
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired session" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  next();
};

export const requireCustomer = (req, res, next) => {
  if (req.user?.role !== "customer")
    return res
      .status(403)
      .json({ success: false, message: "Customer account required" });
  next();
};

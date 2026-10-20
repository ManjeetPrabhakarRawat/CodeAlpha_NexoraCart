import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import {
  authCookieOptions,
  createCsrfToken,
  csrfCookieOptions,
} from "../utils/csrf.js";

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8)
    return res
      .status(400)
      .json({
        success: false,
        message: "Name, valid email and 8+ character password are required",
      });

  const normalized = String(email).trim().toLowerCase();
  if (await User.exists({ email: normalized }))
    return res
      .status(409)
      .json({ success: false, message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: String(name).trim(),
    email: normalized,
    password: passwordHash,
  });
  const csrf = createCsrfToken();
  res.cookie("access_token", signToken(user), authCookieOptions());
  res.cookie("csrf_token", csrf, csrfCookieOptions());
  res.status(201).json({ success: true, user: publicUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: String(email || "")
      .trim()
      .toLowerCase(),
  }).select("+password");
  if (!user || !(await bcrypt.compare(password || "", user.password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });

  const csrf = createCsrfToken();
  res.cookie("access_token", signToken(user), authCookieOptions());
  res.cookie("csrf_token", csrf, csrfCookieOptions());
  res.json({ success: true, user: publicUser(user) });
};

export const logout = async (req, res) => {
  res.clearCookie("access_token", authCookieOptions());
  res.clearCookie("csrf_token", csrfCookieOptions());
  res.json({ success: true });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Account not found" });
  res.json({ success: true, user: publicUser(user) });
};

export const csrf = async (req, res) => {
  const token = createCsrfToken();
  res.cookie("csrf_token", token, csrfCookieOptions());
  res.json({ success: true, csrfToken: token });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || String(newPassword).length < 8)
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Current password and a new 8+ character password are required",
      });

  const user = await User.findById(req.user.sub).select("+password");
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Account not found" });
  if (!(await bcrypt.compare(currentPassword, user.password)))
    return res
      .status(400)
      .json({ success: false, message: "Current password is incorrect" });

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({ success: true, message: "Password changed successfully" });
};

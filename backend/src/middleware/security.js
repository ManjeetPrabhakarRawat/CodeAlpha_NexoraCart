const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (req, res, next) => {
  if (safeMethods.has(req.method)) return next();
  if (
    req.path === "/api/auth/login" ||
    req.path === "/api/auth/register" ||
    req.path === "/api/auth/logout"
  )
    return next();

  const cookieToken = req.cookies?.csrf_token;
  const headerToken = req.get("x-csrf-token");
  if (!cookieToken || !headerToken || cookieToken !== headerToken)
    return res
      .status(403)
      .json({ success: false, message: "Invalid CSRF token" });

  next();
};

export const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  if (id && !/^[a-f\d]{24}$/i.test(id))
    return res
      .status(400)
      .json({ success: false, message: "Invalid resource id" });
  next();
};

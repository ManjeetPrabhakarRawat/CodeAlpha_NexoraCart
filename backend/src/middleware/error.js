export const notFound = (req, res) =>
  res.status(404).json({ success: false, message: "API route not found" });

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message:
      process.env.NODE_ENV === "production" && status >= 500
        ? "Internal server error"
        : err.message || "Something went wrong",
  });
};

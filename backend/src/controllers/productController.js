import Product from "../models/Product.js";

const makeSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const uniqueSlug = async (name, requestedSlug = "", currentId = null) => {
  const base =
    makeSlug(requestedSlug) || makeSlug(name) || `product-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  while (
    await Product.exists({
      slug,
      ...(currentId ? { _id: { $ne: currentId } } : {}),
    })
  ) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

const cleanPage = (v, fallback, max) =>
  Math.min(Math.max(Number(v) || fallback, 1), max);

export const listProducts = async (req, res) => {
  const page = cleanPage(req.query.page, 1, 10000);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 48);
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.category && req.query.category !== "all")
    filter.category = req.query.category;
  if (req.query.q)
    filter.$text = { $search: String(req.query.q).slice(0, 100) };

  const [items, total] = await Promise.all([
    Product.find(filter)
      .select(
        "name slug description category price originalPrice discount rating reviewCount stock images featured",
      )
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);
  res.json({
    success: true,
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
};

export const categoryProducts = async (req, res) => {
  const items = await Product.find({ category: req.params.category })
    .sort({ featured: -1, createdAt: -1 })
    .limit(48)
    .lean();
  res.json({ success: true, items });
};

export const createProduct = async (req, res) => {
  const allowed = [
    "name",
    "slug",
    "description",
    "category",
    "price",
    "originalPrice",
    "discount",
    "rating",
    "reviewCount",
    "stock",
    "images",
    "featured",
  ];
  const data = Object.fromEntries(
    allowed.filter((k) => k in req.body).map((k) => [k, req.body[k]]),
  );
  data.name = String(data.name || "").trim();
  data.description = String(data.description || "").trim();
  if (!data.name || !data.description)
    return res
      .status(400)
      .json({
        success: false,
        message: "Product name and description are required",
      });
  data.slug = await uniqueSlug(data.name, data.slug);
  const product = await Product.create(data);
  res.status(201).json({ success: true, product });
};

export const updateProduct = async (req, res) => {
  const allowed = [
    "name",
    "slug",
    "description",
    "category",
    "price",
    "originalPrice",
    "discount",
    "rating",
    "reviewCount",
    "stock",
    "images",
    "featured",
  ];
  const data = Object.fromEntries(
    allowed.filter((k) => k in req.body).map((k) => [k, req.body[k]]),
  );
  if ("name" in data) data.name = String(data.name || "").trim();
  if ("description" in data)
    data.description = String(data.description || "").trim();
  if (!data.name || !data.description)
    return res
      .status(400)
      .json({
        success: false,
        message: "Product name and description are required",
      });
  data.slug = await uniqueSlug(data.name, data.slug, req.params.id);
  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  res.json({ success: true });
};

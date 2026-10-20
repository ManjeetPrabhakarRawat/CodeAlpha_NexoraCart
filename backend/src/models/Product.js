import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, maxlength: 3000 },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Beauty & Personal Care",
        "Sports & Fitness",
        "Books & Stationery",
      ],
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 4.2, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    stock: { type: Number, required: true, min: 0, index: true },
    images: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

schema.index({ category: 1, createdAt: -1 });
schema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", schema);

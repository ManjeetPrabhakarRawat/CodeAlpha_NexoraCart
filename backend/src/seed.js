import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import { productImages } from "./productImages.js";

const categories = [
  [
    "Electronics",
    [
      "Wireless Noise-Cancelling Headphones",
      "Smart Fitness Watch",
      "Mechanical RGB Keyboard",
      "65W GaN Fast Charger",
      "Portable Bluetooth Speaker",
      "1080p Webcam",
      "USB-C Hub 8-in-1",
      "Ergonomic Wireless Mouse",
      "Mini Projector",
      "Power Bank 20000mAh",
    ],
  ],
  [
    "Fashion",
    [
      "Classic Denim Jacket",
      "Oversized Cotton Hoodie",
      "Regular Fit Chinos",
      "Minimal Sneakers",
      "Everyday Backpack",
      "Cotton Casual Shirt",
      "Slim Fit Trousers",
      "Canvas Crossbody Bag",
      "Unisex Polo T-Shirt",
      "Classic Analog Watch",
    ],
  ],
  [
    "Home & Kitchen",
    [
      "Air Fryer 4L",
      "Electric Kettle",
      "Non-Stick Cookware Set",
      "Ceramic Dinner Set",
      "Memory Foam Pillow",
      "LED Desk Lamp",
      "Storage Organizer Set",
      "Stainless Steel Bottle",
      "Digital Kitchen Scale",
      "Cotton Bedsheet Set",
    ],
  ],
  [
    "Beauty & Personal Care",
    [
      "Vitamin C Face Serum",
      "Gentle Face Cleanser",
      "Hydrating Body Lotion",
      "Hair Dryer",
      "Beard Trimmer",
      "Sunscreen SPF 50",
      "Lip Care Balm",
      "Aloe Vera Gel",
      "Wooden Hair Brush",
      "Bath & Body Gift Set",
    ],
  ],
  [
    "Sports & Fitness",
    [
      "Yoga Mat",
      "Adjustable Dumbbell",
      "Resistance Band Set",
      "Insulated Sports Bottle",
      "Running Cap",
      "Gym Gloves",
      "Skipping Rope",
      "Foam Roller",
      "Football Training Ball",
      "Cycling Bottle Cage",
    ],
  ],
  [
    "Books & Stationery",
    [
      "JavaScript Handbook",
      "Clean Code Notes",
      "DSA Practice Workbook",
      "Premium Notebook",
      "Gel Pen Set",
      "Desk Planner",
      "Sticky Notes Pack",
      "A4 Sketch Book",
      "Study Highlighter Set",
      "Minimal Desk Journal",
    ],
  ],
];

const makeSlug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const products = [];
let i = 0;
for (const [category, names] of categories) {
  for (const name of names) {
    const originalPrice = 599 + ((i * 347) % 7500);
    const discount = 10 + (i % 5) * 5;
    const price = Math.round(originalPrice * (1 - discount / 100));
    products.push({
      name,
      slug: makeSlug(name),
      description: `Premium ${name.toLowerCase()} designed for everyday use with dependable quality and a clean, modern finish.`,
      category,
      price,
      originalPrice,
      discount,
      rating: Number((4 + (i % 10) / 10).toFixed(1)),
      reviewCount: 25 + i * 7,
      stock: 8 + (i % 28),
      images: [productImages[name]],
      featured: i < 12,
    });
    i++;
  }
}

const run = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password)
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required for seed");

  const hash = await bcrypt.hash(password, 12);
  await User.updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        name: "NexoraCart Admin",
        email: email.toLowerCase(),
        password: hash,
        role: "admin",
      },
    },
    { upsert: true },
  );
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(
    `Seed complete. ${products.length} products across ${categories.length} categories are ready.`,
  );
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

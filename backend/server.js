import "dotenv/config";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const port = Number(process.env.PORT || 5000);

const start = async () => {
  await connectDB();
  const server = app.listen(port, () => {
    console.log(`NexoraCart API listening on port ${port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal}: shutting down`);
    server.close(() => process.exit(0));
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start().catch((err) => {
  console.error("Startup failed:", err.message);
  process.exit(1);
});

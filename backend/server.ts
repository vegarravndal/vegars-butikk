import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(clerkMiddleware());

async function start() {
  if (!process.env.CLERK_SECRET_KEY) throw new Error("CLERK_SECRET_KEY is required");
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err) => {
  console.error("Backend startup failed:", err);
  process.exit(1);
});

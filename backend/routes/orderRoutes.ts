import express from "express";
import { getAuth } from "@clerk/express";
import Order from "../models/Order";

const router = express.Router();
router.use((req, res, next) => {
  if (!getAuth(req).userId) return res.status(401).json({ error: "Logg inn for å bruke ordrehistorikken" });
  next();
});

router.post("/", async (req, res) => {
  const { userId } = getAuth(req);
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0 || items.some((item) =>
    typeof item?.productId !== "string" || typeof item?.name !== "string" ||
    !Number.isFinite(item?.price) || item.price < 0 ||
    !Number.isInteger(item?.quantity) || item.quantity < 1
  )) {
    return res.status(400).json({ error: "Ugyldig ordre" });
  }

  try {
    // Prices are accepted from the client for this demo; use a trusted product catalog before taking payment.
    const totalAmount = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
    const order = await Order.create({ userId, items, totalAmount });
    res.status(201).json(order);
  } catch (err) {
    console.error("Failed to save order:", err);
    res.status(500).json({ error: "Kunne ikke lagre ordren" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const orders = await Order.find({ userId }).sort({ placedAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ error: "Kunne ikke hente ordrehistorikken" });
  }
});

export default router;

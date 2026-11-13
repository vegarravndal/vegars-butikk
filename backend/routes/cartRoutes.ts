import express from "express";
import { getAuth, requireAuth } from "@clerk/express";
import Cart from "../models/Cart";

const router = express.Router();
router.use(requireAuth());

router.get("/", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const cart = await Cart.findOne({ userId });
    res.json(cart || { items: [] });
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    res.status(500).json({ error: "Kunne ikke hente handlekurven" });
  }
});

router.put("/", async (req, res) => {
  const { userId } = getAuth(req);
  const items = req.body?.items;
  if (!Array.isArray(items) || items.some((item) =>
    typeof item?.id !== "string" || !Number.isInteger(item?.quantity) || item.quantity < 1
  )) {
    return res.status(400).json({ error: "Ugyldig handlekurv" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    res.json(cart);
  } catch (err) {
    console.error("Failed to save cart:", err);
    res.status(500).json({ error: "Kunne ikke lagre handlekurven" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    await Cart.deleteOne({ userId });
    res.status(204).end();
  } catch (err) {
    console.error("Failed to clear cart:", err);
    res.status(500).json({ error: "Kunne ikke tømme handlekurven" });
  }
});

export default router;

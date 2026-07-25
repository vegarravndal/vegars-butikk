import express from "express";
import Cart from "../models/Cart";

const router = express.Router();

// GET /api/cart/:userId – Hent lagret handlevogn
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    console.error("Feil ved henting av cart:", err);
    res.status(500).json({ error: "Kunne ikke hente handlevogn" });
  }
});

// POST /api/cart – Lagre eller oppdater handlevogn
router.post("/", async (req, res) => {
  const { userId, items } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID mangler" });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = items;
    } else {
      cart = new Cart({ userId, items });
    }
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Feil ved lagring av cart:", err);
    res.status(500).json({ error: "Kunne ikke lagre handlevogn" });
  }
});

// DELETE /api/cart/:userId – Slett handlevogn
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Feil ved sletting av cart:", err);
    res.status(500).json({ error: "Kunne ikke slette handlevogn" });
  }
});

export default router;

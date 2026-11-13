import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  placedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", OrderSchema);

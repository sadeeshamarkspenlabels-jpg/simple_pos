import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      pId: {type: Number, required: true}
    },
  ],
  total: { type: Number, required: true },
  cashier: { type: String, required: true }, // username of cashier who made the sale
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

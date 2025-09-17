import mongoose from "mongoose";
import Counter from "./Counter"; // import Counter model

const SaleSchema = new mongoose.Schema({
  _id: { type: String }, // custom invoice ID: INVxxxx
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      pId: { type: Number, required: true },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, required: true },
  cashier: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to generate INVxxxx ID
SaleSchema.pre("save", async function (next) {
  if (!this._id) {
    const counter = await Counter.findOneAndUpdate(
      { name: "invoice" },           // use "invoice" counter
      { $inc: { seq: 1 } },          // increment by 1
      { new: true, upsert: true }    // create if not exist
    );

    const seqNumber = counter.seq.toString().padStart(4, "0"); // 0001, 0002...
    this._id = `INV${seqNumber}`;
  }
  next();
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

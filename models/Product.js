import mongoose from "mongoose";
import Counter from "./Counter";

const ProductSchema = new mongoose.Schema({
  _id: { type: Number }, 
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: {type: Number, required: true},
});

ProductSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "product" },       // use 'name' instead of _id
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // create counter doc if it doesn't exist
    );
    this._id = counter.seq;
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
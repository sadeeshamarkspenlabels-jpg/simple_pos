import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  pId: {
    type: Number,
    unique: true,
    require: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
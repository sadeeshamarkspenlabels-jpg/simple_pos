import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  _id: {type: String},
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

ProductSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "product" },          // counter document name
      { $inc: { seq: 1 } },         // increment sequence
      { new: true, upsert: true }   // create if doesn't exist
    );
    this._id = counter.seq;          // assign sequential number to _id
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
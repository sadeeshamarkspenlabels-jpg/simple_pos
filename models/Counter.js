import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "invoice"
  seq: { type: Number, default: 0 },                    // last invoice number
});

export default mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

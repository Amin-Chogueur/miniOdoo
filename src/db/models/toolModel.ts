import mongoose from "mongoose";

const ToolSchema = new mongoose.Schema(
  {
    code: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    shelf: { type: String, required: true },
    quantity: { type: Number, required: true },
    quantityTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tool = mongoose.models.Tool || mongoose.model("Tool", ToolSchema);

export default Tool;

import mongoose from "mongoose";

const ToolMovementSchema = new mongoose.Schema(
  {
    toolName: { type: String, required: true },
    toolCode: { type: String, required: true },
    takenQuantity: { type: Number, required: true },
    returnedQuantity: {
      type: Number,
      required: function () {
        return !this.isNew;
      },
    },
    employeeTakingTool: { type: String, required: true },
    employeeReturningTool: {
      type: String,
      required: function () {
        return !this.isNew;
      },
    },
    storekeeperGivenName: { type: String, required: true },
    storekeeperReceiverName: { type: String, default: null },
    takenNote: { type: String },
    returnNote: { type: String },
    takenAt: { type: Date, required: true },
    returnedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const ToolMovement =
  mongoose.models.ToolMovement ||
  mongoose.model("ToolMovement", ToolMovementSchema);

export default ToolMovement;

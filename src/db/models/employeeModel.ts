import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, unique: true },
    email: { type: String, unique: true }, //required: true, unique: true i will add these later on in the full version of the mini odoo
    position: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String },
    dateOfBirth: { type: Date },
    dateOfStart: { type: Date },
    isVerify: { type: Boolean, default: false },
    forgotPsswordToken: String,
    forgotPsswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

export default Employee;

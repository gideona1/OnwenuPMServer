import mongoose from "mongoose";
import { authDB } from "../core/databases.js";

const VerificationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 60 * 10 } }
  },
  { timestamps: true }
);

export const Verifications = authDB.model("Verifications", VerificationSchema);

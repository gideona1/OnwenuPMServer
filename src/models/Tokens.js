import mongoose from "mongoose";
import { authDB } from "../core/databases.js";
const ObjectId = mongoose.Types.ObjectId;

const TokenSchema = new mongoose.Schema(
  {
    owner: { type: ObjectId, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 1 * 86400 },
  },
  { timestamps: true }
);

export const Tokens = authDB.model("Tokens", TokenSchema);

import mongoose from "mongoose";
import { paymentDB } from "../core/databases.js";

const ObjectId = mongoose.Types.ObjectId;

const PaymentSchema = new mongoose.Schema(
    {
        paymentIntent: { type: String, required: true, unique: true },
        owner: { type: Object, required: true },
        description: { type: String },
        dueDate: { type: Date, required: true },
    },
    { timestamps: true }
);

export const Payment = paymentDB.model("Payments", PaymentSchema);

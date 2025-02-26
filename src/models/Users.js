import mongoose from "mongoose";
import { appDataDB } from "../core/databases.js";

const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new mongoose.Schema(
    {
        phoneNumber: { type: String, required: true, unique: true },
        email: { type: String, unique: true, required: true },
        name: { type: String, default: "Unnamed Tenant", maxLength: 30 },
        rentMonthly: { type: Number, default: 0 },
        balance: { type: Number, default: 0 },
        currentPaymentIntent: { type: String },
        customerID: { type: String },
        propertyID: { type: ObjectId },
        userType: { type: String, enum: ['tenant', 'admin'], default: 'tenant' }
    },
    { timestamps: true }
);

export const Users = appDataDB.model("Users", UserSchema);

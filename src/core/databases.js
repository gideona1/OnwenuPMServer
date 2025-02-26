import mongoose from "mongoose";

const appDataDB = mongoose.connection.useDb("appData");
const paymentDB = mongoose.connection.useDb("paymentData");
const authDB = mongoose.connection.useDb("authData");

export { appDataDB, paymentDB, authDB };

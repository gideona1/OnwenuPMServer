// import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";

// import { } from "../methods/Mutation/index.js";
import { getUser, verifyUser } from "../methods/Query/index.js";
import { paymentSheet, getPaymentInfo, getUpcomingPaymentInfo, getPastDuePaymentInfo, getPaymentHistoryInfo, getChargeInfo } from "../methods/Payments/index.js";
import { createUser, getAllUsers, createPayments } from "../methods/Admin/index.js";
import { createVerification, verifyCode } from "../methods/Mutations/index.js";
import { status, amount } from "../methods/PaymentIntent/index.js";
import { dateScalar } from "./scalars/dateScalar.js";

export const resolvers = {
  Date: dateScalar,

  Query: {
    getUser,
    getAllUsers,
    getPaymentInfo,
    getUpcomingPaymentInfo,
    getPaymentHistoryInfo,
    getPastDuePaymentInfo,
    getChargeInfo,
    verifyUser
  },

  Mutation: {
    createUser,
    createVerification,
    createPayments,
    verifyCode,
    paymentSheet,
  },

  PaymentIntent: {
    status,
    amount,
    id: (parent) => { return parent }
  }
};

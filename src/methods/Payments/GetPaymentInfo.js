import { GraphQLError } from "graphql";
import { Payment } from "../../models/Payments.js";
import { Users } from "../../models/Users.js";
import checkUserExist from "../Utils/CheckUserExist.js";

export const getPaymentInfo = async (_, { paymentId }) => {
  if (autoLogout) {
    throw new GraphQLError("Due to inactivity, we logged you out for security reasons.", {
      extensions: {
        code: "USER_UNAUTHENTICATED",
      },
    });
  }

  try {
    return await Payment.findById(paymentId);
  } catch (error) {
    throw new GraphQLError("The payment info you are trying to access does not exist", {
      extensions: {
        code: "PAYMENT_UNDEFINED_NULL",
      },
    });
  }
};

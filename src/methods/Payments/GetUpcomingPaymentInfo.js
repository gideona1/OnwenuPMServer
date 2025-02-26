import { GraphQLError } from "graphql";
import { Payment } from "../../models/Payments.js";
import { Users } from "../../models/Users.js";
import checkUserExist from "../Utils/CheckUserExist.js";
import mongoose from "mongoose";

export const getUpcomingPaymentInfo = async (_, __, { user: { id, autoLogout } }) => {
  if (autoLogout) {
    throw new GraphQLError("Due to inactivity, we logged you out for security reasons.", {
      extensions: {
        code: "USER_UNAUTHENTICATED",
      },
    });
  }

  const user = await checkUserExist(id);

  // Check user exist
  if (!user) {
    throw new GraphQLError("There was a problem accessing your account.", {
      extensions: {
        code: "USER_UNDEFINED_NULL",
      },
    });
  }

  try {
    const currentDate = new Date();
    console.log(currentDate.getFullYear());
    const data = await Payment.findOne({
      owner: new mongoose.Types.ObjectId(id.toString()),
      dueDate: {
        $gte: new Date(),
        $lte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 31)
      }
    });

    return data;
  } catch (error) {
    console.log(error);
    throw new GraphQLError("The payment info you are trying to access does not exist", {
      extensions: {
        code: "PAYMENT_UNDEFINED_NULL",
      },
    });
  }
};

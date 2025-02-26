import { GraphQLError } from "graphql";
import { Payment } from "../../models/Payments.js";
import checkUserExist from "../Utils/CheckUserExist.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const getPaymentHistoryInfo = async (_, __, { user: { id, autoLogout } }) => {
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
    const paymentIntent = (await stripe.paymentIntents.search({
      query: `customer:"${user.customerID}" AND status:"succeeded"`
    })).data;

    const paymentIntentIds = paymentIntent.map((data) => { return data.id })

    return await Payment.find({
      paymentIntent: { $in: paymentIntentIds },
      dueDate: {
        $lte: new Date()
      }
    }, null, { sort: { dueDate: -1 } })
  } catch (error) {
    console.log(error);
    throw new GraphQLError("The payment info you are trying to access does not exist", {
      extensions: {
        code: "PAYMENT_UNDEFINED_NULL",
      },
    });
  }
};

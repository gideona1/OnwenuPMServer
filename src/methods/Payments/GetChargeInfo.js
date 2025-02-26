import { GraphQLError } from "graphql";
import { Payment } from "../../models/Payments.js";
import checkUserExist from "../Utils/CheckUserExist.js";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const getChargeInfo = async (_, { paymentId }, { user: { id, autoLogout } }) => {
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

  const payment = await Payment.findById(paymentId);

  console.log(payment.owner.toString(), user._id.toString());
  console.log(payment.owner.toString() != user._id.toString());
  console.log(user.userType);

  if (payment.owner.toString() != user._id.toString() && user.userType != 'admin') {
    throw new GraphQLError("Your account does not have permission.", {
      extensions: {
        code: "USER_REQUEST_DENIED",
      },
    });
  }

  try {
    const paymentChargeId = (await stripe.paymentIntents.retrieve(payment.paymentIntent)).latest_charge;
    const paymentCharge = (await stripe.charges.retrieve(paymentChargeId));
    const paymentType = paymentCharge.payment_method_details.type;

    // console.log(paymentCharge);

    return {
      amount: paymentCharge.amount,
      status: paymentCharge.status,
      created: new Date(paymentCharge.created),
      paymentMethod: paymentType,
      paymentLastFour: paymentType === 'card' ? paymentCharge.payment_method_details.card.last4 : paymentType === 'us_bank_account' ? paymentCharge.payment_method_details.us_bank_account.last4 : undefined,
      receiptNumber: paymentCharge.receipt_number,
      receiptLink: paymentCharge.receipt_url
    };

  } catch (error) {
    console.log(error);
    throw new GraphQLError("The payment info you are trying to access does not exist", {
      extensions: {
        code: "PAYMENT_UNDEFINED_NULL",
      },
    });
  }
};

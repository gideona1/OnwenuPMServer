import dotenv from "dotenv";
import { GraphQLError } from "graphql";
dotenv.config();

import Stripe from 'stripe';
import { Payment } from "../../models/Payments.js";
import checkUserExist from "../Utils/CheckUserExist.js";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const paymentSheet = async (_, { paymentId }, { user: { id, autoLogout } }) => {
    if (autoLogout) {
        throw new GraphQLError("Due to inactivity, we logged you out for security reasons.", {
            extensions: {
                code: "USER_UNAUTHENTICATED",
            },
        });
    }

    const user = await checkUserExist(id);

    if (!user) {
        throw new GraphQLError("The account you are trying to access does not exist", {
            extensions: {
                code: "USER_UNDEFINED_NULL",
            },
        });
    }

    try {
        const paymentOnDB = await Payment.findById(paymentId);
        const customer = await stripe.customers.retrieve(user.customerID);
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: user.customerID },
            { apiVersion: '2023-10-16' }
        );

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentOnDB.paymentIntent);

        return {
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            customerDefaultInfo: user,
            publishableKey: process.env.STRIPE_PUBLISH_KEY
        }
    } catch (error) {
        throw new GraphQLError("There was a problem accessing payment information.", {
            extensions: {
                code: "PAYMENT_UNKNOWN_ERROR",
            },
        });
        console.error(error);
    }
}
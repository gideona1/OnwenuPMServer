import { GraphQLError } from "graphql";
import checkUserExist from "../Utils/CheckUserExist.js";

import Stripe from 'stripe';
import { Payment } from "../../models/Payments.js";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createPayments = async (_, { userId, amount }, { user: { id, autoLogout } }) => {
    if (autoLogout) {
        throw new GraphQLError("Due to inactivity, we logged you out for security reasons.", {
            extensions: {
                code: "USER_UNAUTHENTICATED",
            },
        });
    }

    const requestUser = await checkUserExist(id);

    // Check user exist
    if (!requestUser) {
        throw new GraphQLError("There was a problem accessing your account.", {
            extensions: {
                code: "USER_UNDEFINED_NULL",
            },
        });
    }

    // Check if user is admin
    if (requestUser.userType !== 'admin') {
        throw new GraphQLError("Your account does not have permission.", {
            extensions: {
                code: "USER_REQUEST_DENIED",
            },
        });
    }

    const affectedUser = await checkUserExist(userId)

    if (!affectedUser) {
        throw new GraphQLError("The account you are trying to access does not exist", {
            extensions: {
                code: "USER_UNDEFINED_NULL",
            },
        });
    }

    try {
        for (let iteration = 0; iteration < 2; iteration++) {
            const customer = await stripe.customers.retrieve(affectedUser.customerID);
            // const ephemeralKey = await stripe.ephemeralKeys.create(
            //     { customer: customer.id },
            //     { apiVersion: '2023-10-16' }
            // );

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'usd',
                customer: customer.id,
                payment_method_types: ['card', 'us_bank_account'],
            });

            const newPayment = new Payment({
                paymentIntent: paymentIntent.id,
                owner: affectedUser._id,
                dueDate: new Date(2023, iteration, 0)
            });

            await newPayment.save();
        }

        return true;
        // Create account


    } catch (error) {
        console.log(error);

        throw new GraphQLError("There was a problem creating payments", {
            extensions: {
                code: "PAYMENT_CREATION_ERROR",
            },
        });
    }
}
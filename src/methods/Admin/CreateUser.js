import { Users } from "../../models/Users.js";
import { GraphQLError } from "graphql";
import checkUserExist from "../Utils/CheckUserExist.js";

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createUser = async (_, { phoneNumber, email, name, notTenant }, { user: { id, autoLogout } }) => {
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

    try {
        // Create account
        const newUser = new Users({
            phoneNumber,
            email,
            name,
            customerID: !notTenant ? (await stripe.customers.create({
                email,
                name,
                phone: phoneNumber
            })).id : undefined
        });

        console.log('here');

        await newUser.save();

        return newUser;

    } catch (error) {
        console.log(error);

        throw new GraphQLError("There was a problem creating this account", {
            extensions: {
                code: "USER_CREATION_ERROR",
            },
        });
    }
}
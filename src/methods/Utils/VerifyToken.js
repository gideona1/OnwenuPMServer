import dotenv from "dotenv";
dotenv.config();
import { Tokens } from "../../models/Tokens.js";
import { GraphQLError } from "graphql";

import jwt from "jsonwebtoken";

export const verifyToken = async (token) => {
    try {
        if (!await Tokens.findOne({ token: token.split(" ", 2)[1] })) {
            console.log("token not in database");
            return { user: { id: null, autoLogout: true } };
        } else {
            console.log("find it in db")
        }

        return { user: jwt.verify(token.split(" ", 2)[1], process.env.ACCESS_SECRET) };
    } catch (error) {
        console.warn(error);
        console.log("token expired");

        return { user: { id: null, autoLogout: true } };
    }
}
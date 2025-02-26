import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { GraphQLError } from "graphql";
import generateToken from "../Utils/GenerateToken.js";
import { Verifications } from "../../models/Verifications.js";
import { Users } from "../../models/Users.js";

export const verifyCode = async (_, { email, code }) => {
  email = email.trim();

  const verificationToken = await Verifications.findOne({ email, code });

  if (verificationToken) {
    await verificationToken.deleteOne()
    const user = await Users.findOne({ email });

    // Return Existing User
    if (user) {
      return generateToken(user);
    }
  } else {
    throw new GraphQLError("The verification code entered does not match. Enter the verification code correctly and try again.", {
      extensions: {
        code: "INVALID_VERIFICATION",
      },
    });
  }
};

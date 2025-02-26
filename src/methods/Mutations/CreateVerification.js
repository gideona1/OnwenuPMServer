import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import { GraphQLError } from "graphql";

import { Verifications } from "../../models/Verifications.js";
import { Users } from "../../models/Users.js";
import { mtSendCode } from "../../core/mailTemplates/mtSendCode.js";
import { sendMail } from "../../core/sendMail.js";

export const createVerification = async (_, { email }) => {
  email = email.trim();

  if (email == "") {
    throw new GraphQLError("All required input must be filled.", {
      extensions: {
        code: "INVALID_INPUT",
      },
    });
  }

  const user = await Users.findOne({ email });

  if (!user) {
    throw new GraphQLError("This account does not exist in our files. Try again or contact Onwenu Property Management.", {
      extensions: {
        code: "USER_UNDEFINED_NULL",
      },
    });
  }

  try {
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const vertificationToken = new Verifications({
      email,
      code: verificationCode,
    });

    const sendCodeMessage = mtSendCode(verificationCode, user.name);
    sendMail(sendCodeMessage.subject, sendCodeMessage.text, sendCodeMessage.html, user.email);

    // Save credential and user information to DB
    await vertificationToken.save();

    console.log(`Email: ${email}, OTP: ${verificationCode}`)
    return true;
  } catch (error) {
    console.log(error);
    throw new GraphQLError("There was a problem create one time code.", {
      extensions: {
        code: "VERIFY_ERROR",
      },
    });
  }

};

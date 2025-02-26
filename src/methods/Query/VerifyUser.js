import { GraphQLError } from "graphql";
import { Users } from "../../models/Users.js";
import checkUserExist from "../Utils/CheckUserExist.js";

export const verifyUser = async (_, __, { user: { autoLogout } }) => {
  if (autoLogout) {
    throw new GraphQLError("Your session has expired. Please log in again.", {
      extensions: {
        code: "USER_UNAUTHENTICATED",
      },
    });
  }

  return true;
};

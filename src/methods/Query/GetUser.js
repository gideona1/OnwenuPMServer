import { GraphQLError } from "graphql";
import { Users } from "../../models/Users.js";
import checkUserExist from "../Utils/CheckUserExist.js";

export const getUser = async (_, __, { user: { id, autoLogout } }) => {
  if (autoLogout) {
    throw new GraphQLError("Due to inactivity, we logged you out for security reasons.", {
      extensions: {
        code: "USER_UNAUTHENTICATED",
      },
    });
  }

  if (!(await checkUserExist(id))) {
    throw new GraphQLError("The account you are trying to access does not exist", {
      extensions: {
        code: "USER_UNDEFINED_NULL",
      },
    });
  }

  try {
    return await Users.findById(id);
  } catch (error) {
    throw new GraphQLError("The account you are trying to access does not exist", {
      extensions: {
        code: "USER_UNDEFINED_NULL",
      },
    });
  }
};

import { GraphQLError } from "graphql";
import { Users } from "../../models/Users.js";
import checkUserExist from "../Utils/CheckUserExist.js";

export const getAllUsers = async (_, { query }, { user: { id, autoLogout } }) => {
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
    throw new GraphQLError("The account you are trying to access does not exist", {
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
    query = query ? query : "";
    return await Users.find({
      $or: [
        { name: { $regex: new RegExp("^" + query.toLowerCase(), "i") } },
        { email: { $regex: new RegExp("^" + query.toLowerCase(), "i") } }
      ],
    });
  } catch (error) {
    console.warn(error);
    throw new GraphQLError("Unable to complete query", {
      extensions: {
        code: "QUERY_ERROR",
      },
    });
  }
};

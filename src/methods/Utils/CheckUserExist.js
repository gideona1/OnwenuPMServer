import { Schema } from "mongoose";
import { Users } from "../../models/Users.js";

const checkUserExist = async (userID) => {
  if (userID == null) {
    return false;
  }

  try {
    const user = await Users.findById(userID);
    return user;
  } catch (error) {
    return false;
  }
};

export default checkUserExist;

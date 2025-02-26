import jwt from "jsonwebtoken";
import { Tokens } from "../../models/Tokens.js";

const generateToken = async (user) => {
  try {
    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    console.log(payload, user._id, user);

    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { algorithm: "HS256", expiresIn: '1d' });

    const tokenOnDB = await Tokens.findOne({ owner: user._id });
    if (tokenOnDB) await Tokens.findOneAndRemove({ owner: user._id });

    await new Tokens({ owner: user._id, token: accessToken }).save();

    return { accessToken };
  } catch (error) {
    console.log("Unable to generate token. User may not be signed in");
  }
};

export default generateToken;

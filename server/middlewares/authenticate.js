import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

export const authentincateUser = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    console.log("Authenticate token missing")
    return res.status(401).json({ success: false, error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY_JWT);
    // console.log(decoded);
    req.userId = decoded.userID;
    next();
  } catch (err) {
    console.log(`Unexpected error while checking login status by 'authenticateUser' middleware: ${err}`);
    return res
      .status(401)
      .json({ success: false, error: "User Authentication failed" });
  }
};

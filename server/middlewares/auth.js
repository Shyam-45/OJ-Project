import dotenv from "dotenv";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");

dotenv.config();
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

export const authentincateUser = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY_JWT);
    req.userId = decoded.userID;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "User Authentication failed" });
  }
};

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Problem from "../models/Problem.js";

dotenv.config();
const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

export const identifyUser = async (req, res) => {
  try {
    const { userid } = req.params;
    const { userId } = req; // Stored in jwt token

    // Authorization
    if (userid !== userId) {
      return res.status(403).json({ success: false, error: "Access Denied" });
    }

    const userInfo = await User.findOne({ userID: userid });

    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, error: "User does not exist" });
    }

    return res.status(200).json({
      success: true,
      message: "User identification successful",
      name: userInfo.name,
      userID: userInfo.userID,
      email: userInfo.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    if (token) {
      return res
        .status(400)
        .json({ success: false, error: "User already logged in" });
    }

    const { userID, password } = req.body;

    if (!(userID && password)) {
      return res
        .status(401)
        .json({ success: false, error: "All fields are mandatory" });
    }

    const getUser = await User.findOne({ userID });
    if (!getUser) {
      return res.status(401).json({
        success: false,
        error: "User does not exist!",
      });
    }

    const match = await bcrypt.compare(password, getUser.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: "Wrong password",
      });
    }

    const accessToken = jwt.sign({ id: getUser._id, userID }, SECRET_KEY_JWT, {
      expiresIn: "1d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // console.log("User logged in");
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      userId: userID,
    });
  } catch (err) {
    // console.error("Login error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error. Please try again later.",
    });
  }
};

export const userSingup = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    if (token) {
      return res
        .status(400)
        .json({ success: false, error: "User already logged in" });
    }

    const { name, email, userID, password } = req.body;

    if (!(name && email && userID && password)) {
      return res.status(401).json({
        success: false,
        error: "All fields are mandatory",
      });
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      console.log("User already exists with same email");
      return res.status(409).json({
        success: false,
        error: "User already exists with the same email",
      });
    }

    const existingUserID = await User.findOne({ userID });
    if (existingUserID) {
      // console.log("User ID already in use");
      return res.status(409).json({
        success: false,
        error: "User ID already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      userID,
      password: hashedPassword,
    });

    const accessToken = jwt.sign({ id: user._id, userID }, SECRET_KEY_JWT, {
      expiresIn: "1d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // console.log("Account successfully registered");
    return res.status(201).json({
      success: true,
      message: "User saved to DB",
      userId: userID,
    });
  } catch (err) {
    // console.error("Error while saving user to DB:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getUserProblemList = async (req, res) => {
  try {
    const { userid } = req.params;
    const { userId } = req; // Stored in jwt token

    if (userid !== userId) {
      return res.status(403).json({
        success: false,
        error: "You don't have access to these resources.",
      });
    }

    const problems = await Problem.find({ createdBy: userId }).sort({
      _id: -1,
    });
    return res.status(201).json({
      success: true,
      message: "Problem list found successfully",
      problems,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

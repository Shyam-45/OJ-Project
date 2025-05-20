import express from "express";
import bcrypt from "bcryptjs";
import { createRequire } from "module";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import Testcase from "../models/Testcase.js";

const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");

const router = express.Router();

// Login route
router.post("/users/login", async (req, res) => {
  try {
    // Get data from request
    const { email, password } = req.body;

    // Validate no filed is empty
    if (!(email && password)) {
      return res.status(401).send("All fields are mandatory");
    }

    // Check if user exist in DB
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.status(404).send("User not exist!");
    }

    // Check is password is correct
    const match = await bcrypt.compare(password, getUser.password);
    if (!match) {
      return res.status(401).send("Wrong Password");
    }

    // generate a token for user
    const accessToken = jwt.sign(
      { id: getUser._id, email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: getUser._id, email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set the refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Not accessible to JavaScript
      secure: true, // Only over HTTPS in prod
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    console.log("User logged in");
    res
      .status(201)
      .json({ message: "User successfully logged in", accessToken });
  } catch (err) {
    console.log(err);
  }
});

// Register/Sign Up route
router.post("/users/register", async (req, res) => {
  try {
    // Get data from request
    const { name, email, userID, password } = req.body;
    console.log(`name = ${name}`);
    console.log(`email = ${email}`);
    console.log(`userID = ${userID}`);
    console.log(`password = ${password}`);

    // Validate no filed is empty
    if (!(name && email && userID && password)) {
      return res.status(400).send("All fields are mandatory");
    }

    // Check if user already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      console.log("User already exists with same email");
      return res.status(200).send("User already exists with same email");
    }

    const existingUserID = await User.findOne({ userID });
    if (existingUserID) {
      console.log("User ID already in use");
      return res.status(200).send("User ID already in use");
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in DB
    const user = await User.create({
      name,
      email,
      userID,
      password: hashedPassword,
    });

    // generate a token for user
    const accessToken = jwt.sign(
      { id: user._id, email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    user.token = accessToken;
    user.password = undefined;

    const refreshToken = jwt.sign(
      { id: user._id, email },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Set the refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Not accessible to JavaScript
      secure: true, // Only over HTTPS in prod
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    console.log("Account successfully registered");
    console.log(user);
    res.status(201).json({ message: "USer saved to DB", user });
  } catch (err) {
    console.log(err);
  }
});

// Log Out route
router.post("/users/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(400).send("logout rout accessed");
});

// Read(GET) Problem route
router.get("/problem/:problemID", async (req, res) => {
    console.log(req.params);

  try {

    const problemID = req.params.problemID;
    if (!problemID) {
        return res.json({message: "ProblemID missing"});
        // Not sure if this is required
    }

    const problemInfo = await Problem.findOne({problemID});
    if (!problemInfo) {
        return res.json({message: "Problem not fouund"});
    }

    console.log("Problem sent to dashboard");
    console.log(problemInfo);
    res.json({ message: `ProblemID: ${problemID}`, problemInfo});
  } catch (err) {
    console.log(`Error occurred while deleting problem, ${err}`);
    res.json({ success: "failed", err });
  }
});

// Create Problem route
router.post("/problem", async (req, res) => {
  //   console.log(req.body);

  // Get info from req.body
  try {

    if (false) {
        // here we will check if user is logged in
    }

    const {
      title,
      description,
      tags,
      inputInfo,
      outputInfo,
      sampleInputOutput,
      inputOutput,
      createdBy,    // In future this will be replaced by above check
    } = req.body;

    if (
      !(title && description && tags && inputInfo && outputInfo && createdBy)
    ) {
      console.log("Few enteries missing");
      return res.json({ message: "Enter all required fields" });
    }

    // Generate problemID and testcaseID
    const problemID = uuidv4();
    const testcaseID = uuidv4();

    // Generate sioID for sample test cases
    sampleInputOutput.forEach((sio) => (sio.sioID = uuidv4()));

    // Generate ioID for test cases
    inputOutput.forEach((io) => (io.ioID = uuidv4()));

    console.log(`problemID: ${problemID}`);
    console.log(`testcaseID: ${testcaseID}`);
    console.log(`title: ${title}`);
    console.log(`description: ${description}`);
    console.log(`inputInfo: ${inputInfo}`);
    console.log(`outputInfo: ${outputInfo}`);
    console.log(sampleInputOutput);
    console.log(inputOutput);
    console.log(createdBy);

    // Store newProblem in DB
    const newProblem = await Problem.create({
      problemID,
      title,
      description,
      tags,
      inputInfo,
      outputInfo,
      sampleInputOutput,
      createdBy,
    });

    // Store testcase in DB
    const newTestcase = await Testcase.create({
      testcaseID,
      problemID,
      inputOutput,
      createdBy,
    });

    console.log("Problem added to DB");
    res.json({ message: "Problem added to DB" });
  } catch (err) {
    console.log(`Error occurred while saving problem, ${err}`);
    res.json({ success: "failed", err });
  }
});

// Delete Problem route
router.delete("/problem/:problemID", async (req, res) => {
  //   console.log(req.body);

  // Get info from req.body
  try {

    if (false) {
        // here we will check if user is logged in
    }

    const problemID = req.params.problemID;
    if (!problemID) {
        return res.json({message: "ProblemID missing"});
        // Not sure if this is required
    }

    const {email} = req.body;
    // get email of logged in user from cookie
    console.log(`Delete request by ${email}`);

    // Check if user and problem creater are same
    const problemCreater = await Problem.findOne({problemID});
    if (!problemCreater) {
        return res.json({message: "Problem not found"});
    }

    console.log(`Problem created by ${problemCreater.createdBy.email}`);
    if (problemCreater.createdBy.email !== email) {
        return res.status(403).json({message: "User does not have permission to delete this problem."})
    }

    // Delete from problems collection
    const deleteProblemInfo = await Problem.deleteOne({problemID});
    // if (deleteProblemInfo.deletedCount === 0) {
    //     return res.json({message: "Issue while deleting problem from problems collection"});
    // }

    // Delete corresponding testcase
    const deleteTestcaseInfo = await Testcase.deleteOne({problemID});
    // if (deleteTestcaseInfo.deletedCount === 0) {
    //     return res.json({message: "Failed to delete test case from testcases collection"});
    // }

    console.log("Problem deletd from DB");
    res.json({ message: "Problem deleted successfully" });
  } catch (err) {
    console.log(`Error occurred while deleting problem, ${err}`);
    res.json({ success: "failed", err });
  }
});

export default router;

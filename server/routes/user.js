import express from "express";
import {
  userLogin,
  userSingup,
  identifyUser,
  getUserProblemList,
} from "../controllers/user.js";
import { authentincateUser } from "../middlewares/authenticate.js";

const router = express.Router();

// Login route
router.post("/login", userLogin);

// Register route
router.post("/register", userSingup);

router.use(authentincateUser);

// Log Out route
router.get("/logout", (req, res) => {
  console.log("User logged out");
  return res
    .clearCookie("accessToken")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

// Individual user problem list route
router.get("/:userid/problem", getUserProblemList);

// Identify User route
router.get("/:userid", identifyUser);

export default router;

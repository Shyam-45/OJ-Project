import express from "express";
import { userLogin, userSingup } from "../controllers/user.js";

const router = express.Router();

// Login route
router.post("/login", userLogin);

// Register route
router.post("/register", userSingup);

// Log Out route
router.get("/logout", (req, res) => {
  res
    .clearCookie("accessToken")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

export default router;

import express from "express";
import { userLogin, userSingup, identifyUser } from "../controllers/user.js";
import { authentincateUser } from "../middlewares/authenticate.js";

const app = express();
const router = express.Router();

// Login route
router.post("/login", userLogin);

// Register route
router.post("/register", userSingup);

app.use(authentincateUser);

// Identify User route
router.get("/me", identifyUser);

// Log Out route
router.get("/logout", (req, res) => {
  console.log("User logged out");
  return res
    .clearCookie("accessToken")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

export default router;

import express from "express";
import {
  userLogin,
  userSingup,
  identifyUser,
  getUserProblemList,
} from "../controllers/user.js";
import { authentincateUser } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/login", userLogin);

router.post("/register", userSingup);

router.use(authentincateUser);

router.get("/logout", (req, res) => {
  // console.log("User logged out");
  return res
    .clearCookie("accessToken")
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

router.get("/:userid/problem", getUserProblemList);

router.get("/:userid", identifyUser);

export default router;

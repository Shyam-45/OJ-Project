import express from "express";
import user from "./user.js";
import problem from "./problem.js";
import bookmark from "./bookmark.js";
import { authentincateUser } from "../middlewares/authenticate.js";

const router = express.Router();

router.use("/user", user);

router.use("/problem", problem);

router.use("/bookmark", bookmark);

router.get("/authlogin", authentincateUser, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User Authentication successful",
    userid: req.userId,
  });
});

export default router;

import express from "express";
import { authentincateUser } from "../middlewares/authenticate.js";

import {
  toggleBookmark,
  getBookmarkedProblems,
} from "../controllers/bookmark.js";

const router = express.Router();

router.use(authentincateUser);

router.put("/:problemId", toggleBookmark);

router.get("/", getBookmarkedProblems);

export default router;

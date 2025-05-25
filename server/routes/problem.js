import express from "express";
import {showProblemList, showProblem, createProblem, deleteProblem} from "../controllers/problem.js"
import { codeOutput } from "../controllers/submission.js";

const router = express.Router();

// Show all problems
router.get("", showProblemList);

// Create Problem route
router.post("/newProblem", createProblem);

// Run problem route
router.post("/:problemID/run", codeOutput);

// Read & delete Problem route
router.route("/:problemID")
  .get(showProblem)
  .delete(deleteProblem);

export default router;

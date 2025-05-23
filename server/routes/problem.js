import express from "express";
import {showProblemList, showProblem, createProblem, deleteProblem} from "../controllers/problem.js"

const router = express.Router();

// Show all problems
router.get("", showProblemList);

// Create Problem route
router.post("/newProblem", createProblem);

// Read & delete Problem route
router.route('/:problemID')
  .get(showProblem)
  .delete(deleteProblem);

export default router;
import express from "express";
import multer from "multer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  showProblemList,
  showProblem,
  createProblem,
  deleteProblem,
} from "../controllers/problem.js";
import { codeOutput, codeVerdict } from "../controllers/submission.js";

const router = express.Router();

// Show all problems
router.get("", showProblemList);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../utils/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// Create Problem route
router.post(
  "/newProblem",
  upload.fields([
    { name: "sampleInputFile", maxCount: 1 },
    { name: "sampleOutputFile", maxCount: 1 },
    { name: "inputFile", maxCount: 1 },
    { name: "outputFile", maxCount: 1 },
  ]),
  createProblem
);

// Run problem route
router.post("/:problemID/run", codeOutput);

// Submit problem route
router.post("/:problemID/submit", codeVerdict);

// Read & delete Problem route
router.route("/:problemID").get(showProblem).delete(deleteProblem);

export default router;

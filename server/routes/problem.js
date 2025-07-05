import express from "express";
import multer from "multer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {
  showProblemList,
  showProblem,
  createProblem,
  deleteProblemAndTestcases,
  getProblemAndTestcases,
} from "../controllers/problem.js";
import {
  customOutput,
  codeOutput,
  codeVerdict,
} from "../controllers/submission.js";
import { authentincateUser } from "../middlewares/authenticate.js";

const router = express.Router();

router.use(authentincateUser);

router.get("", showProblemList);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../utils/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

router.post(
  "/new",
  upload.fields([
    { name: "sampleInputFile", maxCount: 1 },
    { name: "sampleOutputFile", maxCount: 1 },
    { name: "inputFile", maxCount: 1 },
    { name: "outputFile", maxCount: 1 },
  ]),
  createProblem
);

router.post("/customrun", customOutput);

router.post("/:problemID/run", codeOutput);

router.post("/:problemID/submit", codeVerdict);

router.get("/:problemID/view", getProblemAndTestcases);

router.delete("/:problemID/:userid", deleteProblemAndTestcases);

router.get("/:problemID", showProblem);

export default router;

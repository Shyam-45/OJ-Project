import express from "express";
import { runCustomCode } from "../controllers/runCustomCode.js";
import { runCode } from "../controllers/runCode.js";
import { submitCode } from "../controllers/submitCode.js";

const router = express.Router();

router.post("/run/custom", runCustomCode);
router.post("/run", runCode);
router.post("/submit", submitCode);

export default router; 

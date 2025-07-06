import axios from "axios";
import dotenv from "dotenv";
import Testcase from "../models/Testcase.js";
import { runCustomCode } from "./runCustomCode.js";
import { runCode } from "./runCode.js";
import { submitCode } from "./submitCode.js";

dotenv.config();
const compiler_url = process.env.COMPILER_URL;

export const customOutput = async (req, res) => {
  const { language = "cpp", code, inputValue } = req.body;

  if (code === undefined || code.trim() === "") {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }

  return runCustomCode(req, res);
};

export const codeOutput = async (req, res) => {
  const { problemID } = req.params;
  const { language = "cpp", code } = req.body;
  if (code === undefined || code.trim() === "") {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }
  try {
    const testcaseInfo = await Testcase.findOne({ problemID });
    const sampleInputOutput = testcaseInfo.sampleInputOutputFile;

    req.body["sampleInputOutput"] = sampleInputOutput;

    return runCode(req, res);
  } catch (err) {
    res.status(500).json({ success: false, error: "something went wrong" });
  }
};

export const codeVerdict = async (req, res) => {
  const { problemID } = req.params;
  const { language = "cpp", code } = req.body;

  if (code === undefined || code.trim() === "") {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }
  try {
    const testcaseInfo = await Testcase.findOne({ problemID });
    const inputOutput = testcaseInfo.inputOutputFile;

    req.body["inputOutput"] = inputOutput;

    return submitCode(req, res);
  } catch (err) {
    res.status(500).json({ success: false, error: "something went wrong" });
  }
};

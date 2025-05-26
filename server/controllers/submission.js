import { generateFile } from "../utils/generateFile.js";
import { executeC } from "../utils/executeC.js";
import { executeCpp } from "../utils/executeCpp.js";
import { executePy } from "../utils/executePy.js";
import { executeJs } from "../utils/executeJs.js";
import { executeJava } from "../utils/executeJava.js";
import Testcase from "../models/Testcase.js";

export const codeOutput = async (req, res) => {
  console.log("req for code run");

  const { problemID } = req.params;
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }
  try {
    console.log(problemID);
    const problemInfo = await Testcase.findOne({ problemID });
    const sampleInputOutput = problemInfo.sampleInputOutputFile;

    const filePath = generateFile(language, code);
    let output = {
      success: "",
      message: "",
      error: "",
    };
    let count = 0;

    for (const item of sampleInputOutput) {
      try {
        if (language === "cpp") {
          output = await executeCpp(filePath, item.sampleInputFile);
        } else if (language === "py") {
          console.log("Python file received");
          output = await executePy(filePath, item.sampleInputFile);
        } else if (language === "js") {
          output = await executeJs(filePath, item.sampleInputFile);
        } else if (language === "java") {
          output = await executeJava(filePath, item.sampleInputFile);
        } else if (language === "c") {
          output = await executeC(filePath, item.sampleInputFile);
        }

        if (!output.success) {
          break;
        }
      } catch (err) {
        output = { success: false, error: err };
        break;
      }

      if (!output.success) {
        return res
          .status(200)
          .json({ success: false, filePath, error: output.error });
      }
      const userOutput = output.message.replace(/\r\n/g, "\n").trim();
      const expectedOutput = item.sampleOutputFile
        .replace(/\r\n/g, "\n")
        .trim();
        // console.log(userOutput);
        // console.log(expectedOutput);
      if (!(userOutput === expectedOutput)) {
        break;
      }
      count++;
    }

    if (!output.success) {
      return res
        .status(200)
        .json({ success: false, filePath, error: output.error });
    }

    return res.status(200).json({
      success: true,
      filePath,
      count,
      total: `${sampleInputOutput.length}`,
    });
  } catch (err) {
    console.error("Error while running code: ", err.message);
    res.status(500).json({ success: false, filePath, error: err.message });
  }
};

export const codeVerdict = async (req, res) => {
  console.log("req for code submission");

  const { problemID } = req.params;
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }
  try {
    console.log(problemID);
    const problemInfo = await Testcase.findOne({ problemID });
    const inputOutput = problemInfo.inputOutputFile;

    const filePath = generateFile(language, code);
    let output = {
      success: "",
      message: "",
      error: "",
    };
    let count = 0;

    for (const item of inputOutput) {
      try {
        if (language === "cpp") {
          output = await executeCpp(filePath, item.inputFile);
        } else if (language === "py") {
          console.log("Python file received");
          output = await executePy(filePath, item.inputFile);
        } else if (language === "js") {
          output = await executeJs(filePath, item.inputFile);
        } else if (language === "java") {
          output = await executeJava(filePath, item.inputFile);
        } else if (language === "c") {
          output = await executeC(filePath, item.inputFile);
        }

        if (!output.success) {
          break;
        }
      } catch (err) {
        output = { success: false, error: err };
        break;
      }

      if (!output.success) {
        return res
          .status(200)
          .json({ success: false, filePath, error: output.error });
      }
      const userOutput = output.message.replace(/\r\n/g, "\n").trim();
      const expectedOutput = item.outputFile.replace(/\r\n/g, "\n").trim();
      if (!(userOutput === expectedOutput)) {
        break;
      }
      count++;
    }

    if (!output.success) {
      return res
        .status(200)
        .json({ success: false, filePath, error: output.error });
    }

    return res.status(200).json({
      success: true,
      filePath,
      count,
      total: `${inputOutput.length}`,
    });
  } catch (err) {
    console.error("Error while running code for verdict: ", err.message);
    res.status(500).json({ success: false, filePath, error: err.message });
  }
};

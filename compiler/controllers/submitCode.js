import fs from "fs/promises";
import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/executeCpp.js";
import { executePy } from "../utils/executePy.js";
import { executeJs } from "../utils/executeJs.js";
import { executeJava } from "../utils/executeJava.js";
import { executeC } from "../utils/executeC.js";

export const submitCode = async (req, res) => {
  console.log("submitCode endpoint hit");

  const { language, code, inputOutput } = req.body;

  try {
    const filePath = generateFile(language, code);
    let output = {
      success: "",
      message: "",
      error: "",
    };
    let count = 0;
    let testCases = [];

    //     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    try {
      for (const item of inputOutput) {
        let flag = true;
        switch (language) {
          case "cpp":
            output = await executeCpp(filePath, item.inputFile);
            break;
          case "py":
            output = await executePy(filePath, item.inputFile);
            break;
          case "js":
            output = await executeJs(filePath, item.inputFile);
            break;
          case "java":
            output = await executeJava(filePath, item.inputFile);
            break;
          case "c":
            output = await executeC(filePath, item.inputFile);
            break;
          default:
            output = {
              success: false,
              error: "Unsupported language",
            };
            break;
        }

        if (!output.success) {
          return res.status(200).json({ success: false, error: output.error });
        }

        const userOutput = output.message.replace(/\r\n/g, "\n").trim();
        const expectedOutput = item.outputFile.replace(/\r\n/g, "\n").trim();

        const testCase = {
          id: item.iofID,
          status: "passed",
        };

        if (!(userOutput === expectedOutput)) {
          testCase.status = "failed";
          flag = false;
        }
        testCases.push(testCase);
        if (!flag) {
          break;
        }
        count++;
      }
    } catch (err) {
      console.error(err);
      output = { success: false, error: "something went wrong" };
    } finally {
      await Promise.all([fs.unlink(filePath).catch(() => {})]);
    }

    if (!output.success) {
      return res.status(200).json({ success: false, error: output.error });
    }

    return res.status(200).json({
      // success: true,
      // count,
      // total: `${inputOutput.length}`,
      // message: output.message,
      success: true,
      passed: count,
      totalTests: `${inputOutput.length}`,
      testCases,
    });
  } catch (err) {
    console.error("Error while running code: ", err.message);
    res.status(500).json({ success: false, error: "something went wrong" });
  }
};

import fs from "fs/promises";
import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/executeCpp.js";
import { executePy } from "../utils/executePy.js";
import { executeJs } from "../utils/executeJs.js";
import { executeJava } from "../utils/executeJava.js";
import { executeC } from "../utils/executeC.js";

export const runCode = async (req, res) => {
  console.log("runCode endpoint hit");

  const { language, code, sampleInputOutput } = req.body;

  try {
    const filePath = generateFile(language, code);
    let output = {
      success: "",
      message: "",
      error: "",
    };
    let count = 0;

    //     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    try {
      for (const item of sampleInputOutput) {
        switch (language) {
          case "cpp":
            output = await executeCpp(filePath, item.sampleInputFile);
            break;
          case "py":
            console.log("Python file received");
            output = await executePy(filePath, item.sampleInputFile);
            break;
          case "js":
            output = await executeJs(filePath, item.sampleInputFile);
            break;
          case "java":
            output = await executeJava(filePath, item.sampleInputFile);
            break;
          case "c":
            output = await executeC(filePath, item.sampleInputFile);
            break;
          default:
            output = {
              success: false,
              error: "Unsupported language",
            };
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

        if (!(userOutput === expectedOutput)) {
          break;
        }
        count++;
      }
    } catch (err) {
      output = { success: false, error: err };
    } finally {
      // console.log(filePath);
      await Promise.all([fs.unlink(filePath).catch(() => {})]);
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
      message: output.message,
    });
  } catch (err) {
    console.error("Error while running code: ", err.message);
    res.status(500).json({ success: false, filePath, error: err.message });
  }
};

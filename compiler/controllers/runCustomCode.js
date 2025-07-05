import fs from "fs/promises";
import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/executeCpp.js";
import { executePy } from "../utils/executePy.js";
import { executeJs } from "../utils/executeJs.js";
import { executeJava } from "../utils/executeJava.js";
import { executeC } from "../utils/executeC.js";

export const runCustomCode = async (req, res) => {
  const { language, code, inputValue } = req.body;

  try {
    const filePath = generateFile(language, code);
    let output = {
      success: "",
      message: "",
      error: "",
    };

    try {
      switch (language) {
        case "cpp":
          output = await executeCpp(filePath, inputValue);
          break;
        case "py":
          output = await executePy(filePath, inputValue);
          break;
        case "js":
          output = await executeJs(filePath, inputValue);
          break;
        case "java":
          output = await executeJava(filePath, inputValue);
          break;
        case "c":
          output = await executeC(filePath, inputValue);
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
    } catch (err) {
      output = { success: false, error: "something went wrong" };
    } finally {
      await Promise.all([fs.unlink(filePath).catch(() => {})]);
    }

    if (!output.success) {
      return res.status(200).json({ success: false, error: output.error });
    }

    return res.status(200).json({
      success: true,
      message: output.message,
    });
  } catch (err) {
    // console.error("Error while running code: ", err.message);
    res.status(500).json({ success: false, filePath, error: err.message });
  }
};

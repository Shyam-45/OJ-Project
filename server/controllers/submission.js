import { generateFile } from "../utils/generateFile.js";
import { executeC } from "../utils/executeC.js";
import { executeCpp } from "../utils/executeCpp.js";
import { executePy } from "../utils/executePy.js";
import { executeJs } from "../utils/executeJs.js";
import { executeJava } from "../utils/executeJava.js";

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
    const filePath = generateFile(language, code);
    let output = {
      success: "",
      message: "",
      error: "",
    };

    if (language === "cpp") {
      try {
        output = await executeCpp(filePath);
      } catch (err) {
        output.success = false;
        output.error = err;
      }
    } else if (language === "py") {
      try {
        console.log("Python file received");
        output = await executePy(filePath);
      } catch (err) {
        output.success = false;
        output.error = err;
      }
    } else if (language === "js") {
      try {
        output = await executeJs(filePath);
      } catch (err) {
        output.success = false;
        output.error = err;
      }
    } else if (language === "java") {
      try {
        output = await executeJava(filePath);
      } catch (err) {
        output.success = false;
        output.error = err;
      }
    } else if (language === "c") {
      try {
        output = await executeC(filePath);
      } catch (err) {
        output.success = false;
        output.error = err;
      }
    }

    if (!output.success) {
      return res
        .status(200)
        .json({ success: false, filePath, error: output.error });
    }
    res.status(200).json({ success: true, filePath, message: output.message });
  } catch (err) {
    console.error("Error while running code: ", err.message);
    res.status(500).json({ success: false, filePath, error: err.message });
  }
};

import fs from "fs/promises";
import { generateFile } from "../utils/generateFile.js";
import { executeCpp } from "../utils/executeCpp.js";
import { executePy } from "../utils/executePy.js";
import { executeJs } from "../utils/executeJs.js";
import { executeJava } from "../utils/executeJava.js";
import { executeC } from "../utils/executeC.js";

export const runCustomCode = async (req, res) => {
  // console.log(req.body);
  console.log("hit custom run endpoint");
  // console.log("aborting process mid-way");
    // const { payload } = req.body;
    const { language, code, inputValue } = req.body;
  //   console.log(inputValue);
  // return { message: "all good" };

  try {
    const filePath = generateFile(language, code);
    let output = {
      success: "",
      message: "",
      error: "",
    };
    // let count = 0;

    // for (const item of sampleInputOutput) {
      try {
        switch (language) {
          case "cpp":
            output = await executeCpp(filePath, inputValue);
            break;
          case "py":
            console.log("Python file received");
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

        // donownfnfiwonf
        // if (!output.success) {
        //   break;
        // }
              if (!output.success) {
        return res
          .status(200)
          .json({ success: false, filePath, error: output.error });
      }
      } catch (err) {
        output = { success: false, error: err };
        return res
          .status(200)
          .json({ success: false, filePath, error: output.error });
        // break;
      }

      // if (!output.success) {
      //   return res
      //     .status(200)
      //     .json({ success: false, filePath, error: output.error });
      // }
      // const userOutput = output.message.replace(/\r\n/g, "\n").trim();
      // const expectedOutput = item.sampleOutputFile
      //   .replace(/\r\n/g, "\n")
      //   .trim();
      // console.log(userOutput);
      // console.log(expectedOutput);
      // console.log(`expectedOutput: ${expectedOutput}`);
      // console.log(`userOutput: ${userOutput}`);
      // if (!(userOutput === expectedOutput)) {
      //   break;
      // }
      // count++;
    

    // if (!output.success) {
    //   return res
    //     .status(200)
    //     .json({ success: false, filePath, error: output.error });
    // }

    // console.log(output.message);
    return res.status(200).json({
      success: true,
      filePath,
      message: (output.message)
    });
  } catch (err) {
    console.error("Error while running code: ", err.message);
          await Promise.all([fs.unlink(filePath).catch(() => {})]);
    res.status(500).json({ success: false, filePath, error: err.message });
  }
};

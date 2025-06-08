import axios from "axios";
import dotenv from "dotenv";
import Testcase from "../models/Testcase.js";

dotenv.config();
const compiler_url = process.env.COMPILER_URL;

export const customOutput = async(req, res) => {
  const { language = "cpp", code, inputValue } = req.body;

  if (code === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }
  try {
    // const testcaseInfo = await Testcase.findOne({ problemID });
    // const sampleInputOutput = testcaseInfo.sampleInputOutputFile;

    const payload = {
      language,
      code,
      inputValue
    };
    const response = await axios.post(`${compiler_url}/compiler/run/custom`, payload, {
      withCredentials: true,
    });
    const response_data = response.data;
    console.log(response_data);
    return res.status(200).json(response_data);
  } catch (err) {
    console.error("Error while running code: ", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

export const codeOutput = async (req, res) => {
  const { problemID } = req.params;
  const { language = "cpp", code } = req.body;
  if ((code === undefined) || ( (code.trim()) === "")) {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }
  try {
    const testcaseInfo = await Testcase.findOne({ problemID });
    const sampleInputOutput = testcaseInfo.sampleInputOutputFile;

    const payload = {
      language,
      code,
      sampleInputOutput,
    };
    const response = await axios.post(`${compiler_url}/compiler/run`, payload, {
      withCredentials: true,
    });
    const response_data = response.data;
    return res.status(200).json(response_data);
  } catch (err) {
    console.error("Error while sending request to compiler url: ", err.message);
    res.status(500).json({ success: false, error: "something went wrong"});
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
    const testcaseInfo = await Testcase.findOne({ problemID });
    const inputOutput = testcaseInfo.inputOutputFile;

    const payload = {
      language,
      code,
      inputOutput,
    };
    const response = await axios.post(
      `${compiler_url}/compiler/submit`,
      payload,
      {
        withCredentials: true,
      }
    );
    const response_data = response.data;
    console.log(response_data);
    return res.status(200).json(response_data);
  } catch (err) {
    console.error("Error while running code: ", err.message);
    res.status(500).json({ success: false, error: err.message });
  }

  // if (code === undefined) {
  //   return res
  //     .status(400)
  //     .json({ success: false, error: "please enter the code" });
  // }
  // try {
  //   console.log(problemID);
  //   const problemInfo = await Testcase.findOne({ problemID });
  //   const inputOutput = problemInfo.inputOutputFile;

  //   const filePath = generateFile(language, code);
  //   let output = {
  //     success: "",
  //     message: "",
  //     error: "",
  //   };
  //   let count = 0;

  //   for (const item of inputOutput) {
  //     try {
  //       if (language === "cpp") {
  //         output = await executeCpp(filePath, item.inputFile);
  //       } else if (language === "py") {
  //         console.log("Python file received");
  //         output = await executePy(filePath, item.inputFile);
  //       } else if (language === "js") {
  //         output = await executeJs(filePath, item.inputFile);
  //       } else if (language === "java") {
  //         output = await executeJava(filePath, item.inputFile);
  //       } else if (language === "c") {
  //         output = await executeC(filePath, item.inputFile);
  //       }

  //       if (!output.success) {
  //         break;
  //       }
  //     } catch (err) {
  //       output = { success: false, error: err };
  //       break;
  //     }

  //     if (!output.success) {
  //       return res
  //         .status(200)
  //         .json({ success: false, filePath, error: output.error });
  //     }
  //     const userOutput = output.message.replace(/\r\n/g, "\n").trim();
  //     const expectedOutput = item.outputFile.replace(/\r\n/g, "\n").trim();
  //     if (!(userOutput === expectedOutput)) {
  //       break;
  //     }
  //     count++;
  //   }

  //   if (!output.success) {
  //     return res
  //       .status(200)
  //       .json({ success: false, filePath, error: output.error });
  //   }

  //   return res.status(200).json({
  //     success: true,
  //     filePath,
  //     count,
  //     total: `${inputOutput.length}`,
  //   });
  // } catch (err) {
  //   console.error("Error while running code for verdict: ", err.message);
  //   res.status(500).json({ success: false, filePath, error: err.message });
  // }
};

import axios from "axios";
import dotenv from "dotenv";
import Testcase from "../models/Testcase.js";

dotenv.config();
const compiler_url = process.env.COMPILER_URL;

export const customOutput = async (req, res) => {
  const { language = "cpp", code, inputValue } = req.body;

  if (code === undefined || code.trim() === "") {
    return res
      .status(400)
      .json({ success: false, error: "please enter the code" });
  }
  try {
    const payload = {
      language,
      code,
      inputValue,
    };
    const response = await axios.post(
      `${compiler_url}/compiler/run/custom`,
      payload,
      {
        withCredentials: true,
      }
    );
    const response_data = response.data;
    return res.status(200).json(response_data);
  } catch (err) {
    console.error(
      "Error while sending request to custom input url: ",
      err.message
    );
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
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
    res.status(500).json({ success: false, error: "something went wrong" });
  }
};

export const codeVerdict = async (req, res) => {
  // console.log("req for code submission");
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
    console.error(
      "Error while sending request to compiler url for submit: ",
      err.message
    );
    res.status(500).json({ success: false, error: "something went wrong" });
  }
};

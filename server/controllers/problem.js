import { v4 as uuidv4 } from "uuid";
import Problem from "../models/Problem.js";
import Testcase from "../models/Testcase.js";
import { parseSampleTestCases } from "../utils/parseSampletestcase.js";
import { parseTestCases } from "../utils/parseTestcases.js";

export const showProblemList = async (req, res) => {
  console.log("Problem List request");
  try {
    const problemList = await Problem.find();
    console.log(`Problem list send to api`);
    return res.status(200).json({
      success: "true",
      message: "Problem list succesfully sent",
      problemList,
    });
  } catch (err) {
    console.error("Error while fetching problem list", err);
    return res.status(500).json({
      success: "false",
      error: "Error fetching problem list",
    });
  }
};

export const showProblem = async (req, res) => {
  // console.log(req.params);

  try {
    const { problemID } = req.params;
    // if (!problemID) {
    //   return res
    //     .status(404)
    //     .json({ success: false, error: "Problem not found." });
    // }

    const problemInfo = await Problem.findOne({ problemID });
    if (!problemInfo) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found." });
    }

    // console.log("Problem sent to dashboard");
    // console.log(problemInfo);
    res
      .status(200)
      .json({ success: true, message: "Problem found", problemInfo });
  } catch (err) {
    console.error(`Error while fetching problem in db, ${err}`);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const createProblem = async (req, res) => {
  console.log(req.body);

  // Get info from req.body
  try {
    if (false) {
      // here we will check if user is logged in
    }

    const { title, description, tags, inputInfo, outputInfo, createdBy } =
      req.body;

    console.log("Received text fields:");
    console.log({ title, description, tags, inputInfo, outputInfo, createdBy });

    if (
      !(title && description && tags && inputInfo && outputInfo && createdBy)
    ) {
      console.log("Few enteries missing");
      return res.json({ message: "Enter all required fields" });
    }

    let sampleInputOutput = JSON.parse(req.body.sampleInputOutput || {});
    console.log("Sample Input/Output:");
    console.log(sampleInputOutput);

    const sampleInputFile = req.files["sampleInputFile"]?.[0];
    const sampleOutputFile = req.files["sampleOutputFile"]?.[0];
    const inputFile = req.files["inputFile"]?.[0];
    const outputFile = req.files["outputFile"]?.[0];

    console.log("Uploaded files:");
    if (sampleInputFile)
      console.log("Sample Input File:", sampleInputFile.originalname);
    if (sampleOutputFile)
      console.log("Sample Output File:", sampleOutputFile.originalname);
    if (inputFile) console.log("Input File:", inputFile.originalname);
    if (outputFile) console.log("Output File:", outputFile.originalname);

    // Generate problemID and testcaseID
    const problemID = uuidv4();
    const testcaseID = uuidv4();
    console.log("uuid created for problemID and testcaseID");
    // Generate sioID for sample test cases
    // Currently we only have 1 sample test case to display
    let sampleInpOup = sampleInputOutput;
    sampleInputOutput = [{ ...sampleInpOup, sioID: uuidv4() }];
    // sampleInputOutput.forEach((sio) => (sio.sioID = uuidv4()));

    console.log("uuid created for sample test case");
    // Generate ioID for test cases
    // inputOutput.forEach((io) => (io.ioID = uuidv4()));
    // console.log("uuid created for test case");

    console.log(createdBy);

    const sampleInputOutputFile = parseSampleTestCases(
      sampleInputFile.path,
      sampleOutputFile.path
    );
    console.log(
      "Parsed sample input/output testcases:",
      sampleInputOutputFile.length
    );
    console.log(sampleInputOutputFile);
    const inputOutputFile = parseTestCases(inputFile.path, outputFile.path);
    console.log("Parsed input/output testcases:", inputOutputFile.length);

    console.log(inputOutputFile);

    // Store newProblem in DB
    const newProblem = await Problem.create({
      problemID,
      title,
      description,
      tags,
      inputInfo,
      outputInfo,
      sampleInputOutput,
      createdBy,
    });

    // Store testcase in DB
    const newTestcase = await Testcase.create({
      testcaseID,
      problemID,
      sampleInputOutputFile,
      inputOutputFile,
      createdBy,
    });

    console.log("Problem added to DB");
    return res.json({
      success: true,
      message: "we hve received all requested fields",
    });
  } catch (err) {
    console.log(`Error occurred while saving problem, ${err}`);
    res.json({ success: "failed", err });
  }
};

export const deleteProblem = async (req, res) => {
  //   console.log(req.body);

  // Get info from req.body
  try {
    if (false) {
      // here we will check if user is logged in
    }

    const problemID = req.params.problemID;
    if (!problemID) {
      return res.json({ message: "ProblemID missing" });
      // Not sure if this is required
    }

    const { email } = req.body;
    // get email of logged in user from cookie
    console.log(`Delete request by ${email}`);

    // Check if user and problem creater are same
    const problemCreater = await Problem.findOne({ problemID });
    if (!problemCreater) {
      return res.json({ message: "Problem not found" });
    }

    console.log(`Problem created by ${problemCreater.createdBy.email}`);
    if (problemCreater.createdBy.email !== email) {
      return res.status(403).json({
        message: "User does not have permission to delete this problem.",
      });
    }

    // Delete from problems collection
    const deleteProblemInfo = await Problem.deleteOne({ problemID });
    // if (deleteProblemInfo.deletedCount === 0) {
    //     return res.json({message: "Issue while deleting problem from problems collection"});
    // }

    // Delete corresponding testcase
    const deleteTestcaseInfo = await Testcase.deleteOne({ problemID });
    // if (deleteTestcaseInfo.deletedCount === 0) {
    //     return res.json({message: "Failed to delete test case from testcases collection"});
    // }

    console.log("Problem deletd from DB");
    res.json({ message: "Problem deleted successfully" });
  } catch (err) {
    console.log(`Error occurred while deleting problem, ${err}`);
    res.json({ success: "failed", err });
  }
};

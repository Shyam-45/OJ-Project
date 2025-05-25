import { v4 as uuidv4 } from "uuid";
import Problem from "../models/Problem.js";
import Testcase from "../models/Testcase.js";


export const showProblemList = async (req, res) => {
  console.log("Problem List request");
  try {
    const problemList = await Problem.find();
    console.log(`Problem list send to api`);
    return res.json({ success: "true", problemList });
    // return problemList;
  } catch (err) {
    console.log("Error while fetching problem list.");
    return res.json({
      success: "false",
      message: "Error while fetching problems from db",
    });
  }
};

export const showProblem = async (req, res) => {
  console.log(req.params);

  try {
    const { problemID } = req.params;
    if (!problemID) {
      return res.json({ message: "ProblemID missing" });
      // Not sure if this is required
    }

    const problemInfo = await Problem.findOne({ problemID });
    if (!problemInfo) {
      return res.json({ message: "Problem not fouund" });
    }

    console.log("Problem sent to dashboard");
    // console.log(problemInfo);
    res.json({ message: `ProblemID: ${problemID}`, problemInfo });
  } catch (err) {
    console.log(`Error while fetching problem, ${err}`);
    res.json({ success: "failed", err });
  }
};

export const createProblem = async (req, res) => {
  //   console.log(req.body);

  // Get info from req.body
  try {
    if (false) {
      // here we will check if user is logged in
    }

    const {
      title,
      description,
      tags,
      inputInfo,
      outputInfo,
      sampleInputOutput,
      inputOutput,
      createdBy, // In future this will be replaced by above check
    } = req.body;

    if (
      !(title && description && tags && inputInfo && outputInfo && createdBy)
    ) {
      console.log("Few enteries missing");
      return res.json({ message: "Enter all required fields" });
    }

    // Generate problemID and testcaseID
    const problemID = uuidv4();
    const testcaseID = uuidv4();

    // Generate sioID for sample test cases
    sampleInputOutput.forEach((sio) => (sio.sioID = uuidv4()));

    // Generate ioID for test cases
    inputOutput.forEach((io) => (io.ioID = uuidv4()));

    console.log(`problemID: ${problemID}`);
    console.log(`testcaseID: ${testcaseID}`);
    console.log(`title: ${title}`);
    console.log(`description: ${description}`);
    console.log(`inputInfo: ${inputInfo}`);
    console.log(`outputInfo: ${outputInfo}`);
    console.log(sampleInputOutput);
    console.log(inputOutput);
    console.log(createdBy);

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
      inputOutput,
      createdBy,
    });

    console.log("Problem added to DB");
    res.json({ message: "Problem added to DB" });
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

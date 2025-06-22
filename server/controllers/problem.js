import mongoose from "mongoose";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Problem from "../models/Problem.js";
import Testcase from "../models/Testcase.js";
import { parseSampleTestCases } from "../utils/parseSampletestcase.js";
import { parseTestCases } from "../utils/parseTestcases.js";

export const showProblemList = async (req, res) => {
  try {
    const problemList = await Problem.find();
    return res.status(200).json({
      success: "true",
      message: "Problem list succesfully sent",
      problemList,
    });
  } catch (err) {
    return res.status(500).json({
      success: "false",
      error: "Error fetching problem list",
    });
  }
};

export const showProblem = async (req, res) => {
  try {
    const { problemID } = req.params;
    const problemInfo = await Problem.findOne({ problemID });
    if (!problemInfo) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Problem found", problemInfo });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
};

export const createProblem = async (req, res) => {
  let filePaths = [];

  try {
    const { title, description, tags, inputInfo, outputInfo, createdBy } =
      req.body;

    if (
      !(title && description && tags && inputInfo && outputInfo && createdBy)
    ) {
      return res.json({ message: "Enter all required fields" });
    }

    let sampleInputOutput = JSON.parse(req.body.sampleInputOutput || {});

    const sampleInputFile = req.files["sampleInputFile"]?.[0];
    const sampleOutputFile = req.files["sampleOutputFile"]?.[0];
    const inputFile = req.files["inputFile"]?.[0];
    const outputFile = req.files["outputFile"]?.[0];

    const problemID = uuidv4();
    let sampleInpOup = sampleInputOutput;
    sampleInputOutput = [{ ...sampleInpOup, sioID: uuidv4() }];

    const sampleInputOutputFile = parseSampleTestCases(
      sampleInputFile.path,
      sampleOutputFile.path
    );

    const inputOutputFile = parseTestCases(inputFile.path, outputFile.path);
    filePaths = [
      sampleInputFile?.path,
      sampleOutputFile?.path,
      inputFile?.path,
      outputFile?.path,
    ];

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

    const newTestcase = await Testcase.create({
      testcaseID: uuidv4(),
      problemID,
      sampleInputOutputFile,
      inputOutputFile,
      createdBy,
    });

    return res.json({
      success: true,
      message: "we have received all requested fields",
    });
  } catch (err) {
    console.log("error while asving:")
    console.error(err);
    res.json({ success: "failed", err });
  } finally {
    filePaths.forEach((filePath) => {
      if (filePath) {
        fs.unlink(filePath, (err) => {});
      }
    });
  }
};

// export const createProblem = async (req, res) => {
//   let filePaths = [];

//   try {
//     const { title, description, tags, inputInfo, outputInfo, createdBy } = req.body;

//     if (!(title && description && tags && inputInfo && outputInfo && createdBy)) {
//       return res.json({ message: "Enter all required fields" });
//     }

//     let sampleInputOutput = JSON.parse(req.body.sampleInputOutput || {});
//     const sampleInputFile = req.files["sampleInputFile"]?.[0];
//     const sampleOutputFile = req.files["sampleOutputFile"]?.[0];
//     const inputFile = req.files["inputFile"]?.[0];
//     const outputFile = req.files["outputFile"]?.[0];

//     const problemID = uuidv4();
//     const testcaseID = uuidv4();
//     console.log("\n🧪 Generated problemID:", problemID);
//     console.log("🧪 Generated testcaseID:", testcaseID);

//     let sampleInpOup = sampleInputOutput;
//     sampleInputOutput = [{ ...sampleInpOup, sioID: uuidv4() }];

//     const sampleInputOutputFile = parseSampleTestCases(
//       sampleInputFile.path,
//       sampleOutputFile.path
//     );

//     const inputOutputFile = parseTestCases(inputFile.path, outputFile.path);
//     filePaths = [
//       sampleInputFile?.path,
//       sampleOutputFile?.path,
//       inputFile?.path,
//       outputFile?.path,
//     ];

//     // Check if a testcase already exists with the same problemID
//     const existingTestcase = await Testcase.findOne({ problemID });
//     console.log("🧪 Existing testcase for problemID?", existingTestcase ? "YES" : "NO");

//     const newProblem = await Problem.create({
//       problemID,
//       title,
//       description,
//       tags,
//       inputInfo,
//       outputInfo,
//       sampleInputOutput,
//       createdBy,
//     });

//     const newTestcase = await Testcase.create({
//       testcaseID,
//       problemID,
//       sampleInputOutputFile,
//       inputOutputFile,
//       createdBy,
//     });

//     console.log("✅ New problem and testcase created successfully.");

//     return res.json({
//       success: true,
//       message: "We have received all requested fields",
//     });
//   } catch (err) {
//     console.log("❌ Error while saving:");
//     console.error(err);
//     res.json({ success: "failed", err });
//   } finally {
//     // filePaths.forEach((filePath) => {
//     //   if (filePath) {
//     //     fs.unlink(filePath, (err) => {});
//     //   }
//     // });
//   }
// };

// export const createProblem = async (req, res) => {
//   let filePaths = [];

//   try {
//     console.log("\n=== createProblem called ===");
//     console.log("Request body:", req.body);
//     console.log("Request files:", req.files);

//     const { title, description, tags, inputInfo, outputInfo, createdBy } = req.body;

//     if (!(title && description && tags && inputInfo && outputInfo && createdBy)) {
//       console.warn("⚠️ Missing required fields.");
//       return res.json({ success: false, message: "Enter all required fields" });
//     }
//     console.log("✅ Required fields validated.");

//     // Parse sampleInputOutput safely
//     let sampleInputOutput;
//     try {
//       sampleInputOutput = JSON.parse(req.body.sampleInputOutput || "{}");
//       console.log("Parsed sampleInputOutput:", sampleInputOutput);
//     } catch (parseErr) {
//       console.error("❌ Failed to parse sampleInputOutput JSON:", parseErr);
//       return res.json({ success: false, message: "Invalid sampleInputOutput JSON" });
//     }

//     // Extract uploaded files info and check paths
//     const sampleInputFile = req.files["sampleInputFile"]?.[0];
//     const sampleOutputFile = req.files["sampleOutputFile"]?.[0];
//     const inputFile = req.files["inputFile"]?.[0];
//     const outputFile = req.files["outputFile"]?.[0];

//     console.log("Received file paths:", {
//       sampleInputFile: sampleInputFile?.path,
//       sampleOutputFile: sampleOutputFile?.path,
//       inputFile: inputFile?.path,
//       outputFile: outputFile?.path,
//     });

//     if (!sampleInputFile || !sampleOutputFile || !inputFile || !outputFile) {
//       console.warn("⚠️ One or more required files are missing.");
//       return res.json({ success: false, message: "All input/output files must be uploaded" });
//     }

//     // Generate unique IDs
//     const problemID = uuidv4();
//     const testcaseID = uuidv4();
//     console.log("🧪 Generated problemID:", problemID);
//     console.log("🧪 Generated testcaseID:", testcaseID);

//     // Assign unique sioID inside sampleInputOutput
//     sampleInputOutput = [{ ...sampleInputOutput, sioID: uuidv4() }];
//     console.log("Updated sampleInputOutput with sioID:", sampleInputOutput);

//     // Parse test cases from files
//     const sampleInputOutputFile = parseSampleTestCases(
//       sampleInputFile.path,
//       sampleOutputFile.path
//     );
//     console.log("Parsed sampleInputOutputFile:", sampleInputOutputFile);

//     const inputOutputFile = parseTestCases(inputFile.path, outputFile.path);
//     console.log("Parsed inputOutputFile:", inputOutputFile);

//     filePaths = [
//       sampleInputFile.path,
//       sampleOutputFile.path,
//       inputFile.path,
//       outputFile.path,
//     ];

//     // Check if testcase already exists for this problemID
//     const existingTestcase = await Testcase.findOne({ problemID });
//     console.log("🧪 Existing testcase for problemID?", existingTestcase ? "YES" : "NO");

//     // Create problem entry
//     const newProblem = await Problem.create({
//       problemID,
//       title,
//       description,
//       tags,
//       inputInfo,
//       outputInfo,
//       sampleInputOutput,
//       createdBy,
//     });
//     console.log("✅ Created Problem:", newProblem);

//     // Create testcase entry
//     const newTestcase = await Testcase.create({
//       testcaseID,
//       problemID,
//       sampleInputOutputFile,
//       inputOutputFile,
//       createdBy,
//     });
//     console.log("✅ Created Testcase:", newTestcase);

//     console.log("🎉 Successfully created new problem and testcase.");

//     return res.json({
//       success: true,
//       message: "We have received all requested fields",
//       problemID,
//       testcaseID,
//     });
//   } catch (err) {
//     console.error("❌ Error while saving:");
//     console.error(err);
//     return res.json({ success: false, error: err.message || err });
//   } finally {
//     // Cleanup uploaded files
//     if (filePaths.length > 0) {
//       filePaths.forEach((filePath) => {
//         if (filePath) {
//           fs.unlink(filePath, (unlinkErr) => {
//             if (unlinkErr) {
//               console.warn(`⚠️ Failed to delete file at ${filePath}:`, unlinkErr);
//             } else {
//               console.log(`🗑️ Deleted file at ${filePath}`);
//             }
//           });
//         }
//       });
//     }
//   }
// };



export const getProblemAndTestcases = async (req, res) => {
  try {
    const { problemID } = req.params;

    const problemInfo = await Problem.findOne({ problemID });
    if (!problemInfo) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found." });
    }

    const testcaseInfo = await Testcase.findOne({ problemID });
    if (!testcaseInfo) {
      return res
        .status(404)
        .json({ success: false, error: "Test cases not found." });
    }

    const payload = { problemInfo, testcaseInfo };
    return res.status(200).json({
      success: true,
      message: "Problem & testcase successfully fetched",
      payload,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

export const deleteProblemAndTestcases = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { problemID, userid } = req.params;
    const { userId } = req; // Stored in jwt token

    const problemData = await Problem.findOne({ problemID });

    if (!problemData) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }

    // Authorization check
    if (userId !== userid || problemData.createdBy !== userid) {
      return res.status(403).json({
        succes: false,
        error: "You do not have permission to delete this problem",
      });
    }

    await session.withTransaction(async () => {
      await Problem.deleteOne({ problemID }, { session });
      await Testcase.deleteOne({ problemID }, { session });
    });

    return res.status(200).json({
      success: true,
      message: "Problem and corresponding test case deleted successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server errror" });
  } finally {
    session.endSession();
  }
};

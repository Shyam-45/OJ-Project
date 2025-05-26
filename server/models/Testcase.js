import mongoose from "mongoose";

const Schema = mongoose.Schema;

const testcaseSchema = new Schema({
  testcaseID: {
    type: String,
    required: true,
    unique: true,
  },
  problemID: {
    type: String,
    required: true,
    unique: true,
  },
  sampleInputOutputFile: {
    type: [
      {
        siofID: {
          type: String,
          unique: true,
          required: true,
        },
        sampleInputFile: {
          type: String,
          required: true,
        },
        sampleOutputFile: {
          type: String,
          required: true,
        },
      },
    ],
  },
  inputOutputFile: {
    type: [
      {
        iofID: {
          type: String,
          unique: true,
          required: true,
        },
        inputFile: {
          type: String,
          required: true,
        },
        outputFile: {
          type: String,
          required: true,
        },
      },
    ],
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const Testcase = mongoose.model("Testcase", testcaseSchema);

export default Testcase;

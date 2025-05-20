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
    unique: true
  },
  inputOutput: {
    type: [
      {
        ioID: {
          type: String,
          unique: true,
          required: true,
        },
        input: {
          type: String,
          required: true,
        },
        output: {
          type: String,
          required: true,
        },
      },
    ],
  },
  createdBy: {
    email: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
  },
});

const Testcase = mongoose.model("Testcase", testcaseSchema);

export default Testcase;

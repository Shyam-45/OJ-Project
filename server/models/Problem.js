import mongoose from "mongoose";

const Schema = mongoose.Schema;

const problemSchema = new Schema({
  problemID: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    default: null,
  },
  description: {
    type: String,
    required: true,
    default: null,
  },
  tags: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
    default: "easy",
  },
  inputInfo: {
    type: String,
    required: true,
    default: null,
  },
  outputInfo: {
    type: String,
    required: true,
    default: null,
  },
  sampleInputOutput: {
    type: [
      {
        sioID: {
          type: String,
          unique: true
        },
        input: {
          type: String,
        },
        output: {
          type: String,
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

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

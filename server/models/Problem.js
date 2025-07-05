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
          unique: true,
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
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

problemSchema.index({ createdBy: 1 });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;

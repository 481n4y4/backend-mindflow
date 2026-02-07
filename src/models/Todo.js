import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false
    },
    deadline: {
      type: Date,
      required: false
    },
    completed: {
      type: Boolean,
      default: false,
    },
    subTasks: [subTaskSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema)

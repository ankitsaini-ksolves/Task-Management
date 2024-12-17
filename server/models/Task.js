const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  tasks: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      status: {
        type: String,
        enum: ["pending", "in progress", "completed"],
        default: "pending",
      },
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;

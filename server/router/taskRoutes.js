const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const moment = require("moment");

router.get("/today", async (req, res) => {
  const userId = req.query.userId;
  const today = moment().format("YYYY-MM-DD");

  try {
    const taskDoc = await Task.findOne({ userId, date: today });
    const tasks = taskDoc ? taskDoc.tasks : [];
    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch today's tasks", message: error.message });
  }
});

router.get("/tasks/dates/:userId", async (req, res) => {
  try {
    const dates = await Task.find({ userId: req.params.userId }).select(
      "date -_id"
    );
    res.json(dates.map((d) => d.date));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dates" });
  }
});

// Fetch tasks for a specific date
router.get("/tasks/:userId/:date", async (req, res) => {
  try {
    const taskDocument = await Task.findOne({
      userId: req.params.userId,
      date: req.params.date,
    });

    res.json(taskDocument || { tasks: [] });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Delete a task
router.delete("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    // Remove the task directly using the task ID
    const updatedTasks = await Task.findOneAndUpdate(
      { "tasks._id": taskId },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    if (!updatedTasks) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete task", message: err.message });
  }
});

// Add or update tasks for a specific date
router.post("/tasks", async (req, res) => {
  const { userId, date, tasks } = req.body;

  try {
    for (const task of tasks) {
      const { startTime, endTime } = task;
      if (startTime >= endTime) {
        return res
          .status(400)
          .json({ error: `Invalid time range for task: ${task.title}` });
      }
    }

    const existingTasks = await Task.findOne({ userId, date });

    // Validate overlapping times
    if (existingTasks) {
      for (const newTask of tasks) {
        const { startTime: newStart, endTime: newEnd } = newTask;
        for (const existingTask of existingTasks.tasks) {
          const { startTime: existingStart, endTime: existingEnd } =
            existingTask;

          if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          ) {
            return res.status(400).json({
              error: `Time overlaps with another task`,
              taskIndex: tasks.indexOf(newTask),
            });
          }
        }
      }
    }
    const updatedTasks = await Task.findOneAndUpdate(
      { userId, date },
      { $push: { tasks: { $each: tasks } } },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedTasks);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add tasks", message: err.message });
  }
});

router.put("/tasks/:id", async (req, res) => {
  const { id } = req.params; // Task ID to edit
  const { userId, date, title, description, startTime, endTime } = req.body;

  try {
    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ error: "Invalid time range for the task." });
    }

    // Fetch existing tasks for the user and date
    const existingTasks = await Task.findOne({ userId, date });

    if (existingTasks) {
      for (const task of existingTasks.tasks) {
        if (task._id.toString() !== id) {
          // Exclude the current task being edited
          const { startTime: existingStart, endTime: existingEnd } = task;

          if (
            (startTime >= existingStart && startTime < existingEnd) ||
            (endTime > existingStart && endTime <= existingEnd) ||
            (startTime <= existingStart && endTime >= existingEnd)
          ) {
            return res.status(400).json({
              error: `Time overlaps with another task: ${task.title}`,
            });
          }
        }
      }
    }

    // Update the task
    const updatedTask = await Task.findOneAndUpdate(
      { userId, "tasks._id": id },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.startTime": startTime,
          "tasks.$.endTime": endTime,
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.status(200).json({ tasks: updatedTask.tasks, date });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to edit task", message: err.message });
  }
});

router.put("/tasks/:userId/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { userId, "tasks._id": taskId },
      { $set: { "tasks.$.status": status } },
      { new: true }
    );

    if (!updatedTask) {
      console.error(
        "Task not found for UserID:",
        userId,
        "and TaskID:",
        taskId
      );
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err.message);
    res
      .status(500)
      .json({ error: "Failed to update task status", message: err.message });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({ date: { $gte: today } });
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: err.message });
  }
});

module.exports = router;

const Task = require("../models/Task");
const express = require("express");

const router = new express.Router();

router.post("/tasks", async (req, res) => {
  try {
    const task = Task(req.body);
    task.save();
    res.status(201).send("Task is added!");
  } catch (e) {
    res.status(400).send(`Error: ${e}`);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.find({ _id: id });
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const id = req.params.id;
  const keys = Object.keys(req.body);
  try {
    const isAllowed = keys.every((key) => allowedUpdates.includes(key));
    console.log(isAllowed);
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    !isAllowed
      ? res.status(400).send("Not valid key")
      : !task
      ? res.status(400).send("No such a task with the specified id")
      : res.status(200).send("The task is edited");
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

router.delete("/tasks", async (req, res) => {
  try {
    const id = req.query.id;
    const task = await Task.findByIdAndDelete(id);
    !task
      ? res.status(400).send("No task with the specified id")
      : res.status(200).send("The task is deleted");
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

module.exports = router;
const express = require("express");
require("./db/mongoose");
const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/users", (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user
    .save()
    .then((_) => res.status(201).send("User is added successfuly"))
    .catch((err) => res.status(400).send(`Error: ${err}`));
});

app.get("/users", (req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send(`Error: ${err}`));
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  User.find({_id: id})
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send(`Error: ${err}`));
});

app.post("/tasks", (req, res) => {
  const task = Task(req.body);
  task
    .save()
    .then((_) => res.status(201).send("Task is added!"))
    .catch((err) => res.status(400).send(`Error: ${err}`));
});

app.listen(port, () => {
  console.log(`The Server is up on port: ${port}`);
});

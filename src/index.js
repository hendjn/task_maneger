const express = require("express");
require("./db/mongoose");
const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/users", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User is added successfuly");
  } catch (e) {
    res.status(400).send(`Error: ${e}`);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.find({ _id: id });
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

app.patch("/users/:id", async (req, res) => { 
  try {
    const keys = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const id = req.params.id;
    keys.forEach(key => {
      if(!allowedUpdates.includes(key)) return res.status(400).send("Not valid key!");
    });
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user)  res.status(400).send("No user with the entered ID");
   
     res.status(201).send("Updated successfuly!");
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

app.delete("/users", async(req, res) => {  
  try{
    const id = req.query.id;
    const user = await User.findByIdAndDelete(id);
    !user? res.status(400).send("No such user with the specified id"):
    res.status(200).send("The user is deleted")
  }
  catch(e){
    res.status(500).send(`Error: ${e}`);
  }
})

app.post("/tasks", async (req, res) => {
  try {
    const task = Task(req.body);
    task.save();
     res.status(201).send("Task is added!");
  } catch (e) {
    res.status(400).send(`Error: ${e}`);
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
     res.status(200).send(tasks);
  } catch (e) {
     res.status(500).send(`Error: ${e}`);
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.find({ _id: id });
     res.status(200).send(task);
  } catch (e) {
     res.status(500).send(`Error: ${e}`);
  }
});

app.patch("/tasks/:id", async(req, res) => {
  const allowedUpdates = ["description", "completed"];
  const id = req.params.id;
  const keys = Object.keys(req.body);
  try{
    const isAllowed = keys.every(key => allowedUpdates.includes(key));
    console.log(isAllowed)
    const task = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
    !isAllowed? res.status(400).send('Not valid key'):
    !task? res.status(400).send('No such a task with the specified id'):  
    res.status(200).send('The task is edited'); 
  }
  catch(e) {
    res.status(500).send(`Error: ${e}`);
  } 
})

app.delete("/tasks", async(req, res) => {
  try{
    const id = req.query.id;
    const task = await Task.findByIdAndDelete(id);
    !task? res.status(400).send("No task with the specified id"):
    res.status(200).send("The task is deleted")
  }
  catch(e){
    res.status(500).send(`Error: ${e}`);
  }
})

app.listen(port, () => {
  console.log(`The Server is up on port: ${port}`);
});

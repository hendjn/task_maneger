const User = require("../models/User");
const express = require("express");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send("User is added successfuly");
  } catch (e) {
    res.status(400).send(`Error: ${e}`);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.find({ _id: id });
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const id = req.params.id;
    keys.forEach((key) => {
      if (!allowedUpdates.includes(key))
        return res.status(400).send("Not valid key!");
    });
    const user = await User.findById(id);
    if (!user) res.status(400).send("No user with the entered ID");
    keys.forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.status(201).send("Updated successfuly!");
  } catch (e) {
    res.status(400).send(`Error: ${e}`);
  }
});

router.delete("/users", async (req, res) => {
  try {
    const id = req.query.id;
    const user = await User.findByIdAndDelete(id);
    !user
      ? res.status(400).send("No such user with the specified id")
      : res.status(200).send("The user is deleted");
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

// router.post("users/login", (req, res) => {
//   try{
//     const user = await User.findByCredentials(req.body.email, req.body.password);
//   }catch(e){
//     res.status(400).send(`Error: ${e}`)
//   }


//});

module.exports = router;

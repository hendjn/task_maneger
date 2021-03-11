const User = require("../models/User");
const express = require("express");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({msg: "User is added successfuly", token});
  } catch (e) {
    res.status(400).send(`Error: ${e}`);
  }
});

router.post("/users/login", async(req, res) => {
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.status(200).send({user, token})
  }catch(e){
    res.status(400).send(`Error: ${e}`)
  }
});

router.post("/users/logout", auth, async(req, res) => {
  try{
    console.log(console.log('token', req.token))
    const user = await User.findById(req.user._id);
    user.tokens = user.tokens.filter(tokenObj => tokenObj.token!=req.token);
    
    await user.save();
    
    res.status(200).send({msg: 'Logged out successfuly!'})
  }catch(e){
    res.status(400).send(`Error: ${e}`)
  }
});

router.get("/users/me",auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

router.get("/users/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.find({ _id: id });
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(`Error: ${e}`);
  }
});

router.patch("/users/:id", auth, async (req, res) => {
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

router.delete("/users", auth, async (req, res) => {
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



module.exports = router;

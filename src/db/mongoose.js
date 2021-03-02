const mongoose = require("mongoose");

console.log('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/task-maneger-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
});

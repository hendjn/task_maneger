const express = require("express");
require("./db/mongoose");
require('dotenv').config();

///////////////Routes///////////////
const usersRoutes = require("./routes/users.routes");
const tasksRoutes = require("./routes/tasks.routes");

const app = express();

app.use(express.json());
app.use(usersRoutes);
app.use(tasksRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The Server is up on port: ${port}`);
});

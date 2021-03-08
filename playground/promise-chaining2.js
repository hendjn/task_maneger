require("../src/db/mongoose");
const Task = require("../src/models/Task");

Task.findByIdAndRemove("603e18bcdd95710aec5c64cc")
  .then((task) => {
    console.log(task);
    return Task.countDocuments({ complteted: false });
  })
  .then((tasks) => console.log(tasks))
  .catch((err) => console.log(`Error: ${err}`));

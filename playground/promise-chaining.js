require("../src/db/mongoose");
const User = require("../src/models/User");
//603cdcebbbdae9234c4f211b

User.findByIdAndUpdate("603cdcebbbdae9234c4f211b", {
  age: 11,
})
  .then((_) => User.countDocuments({ age: 11 }))
  .then((result) => console.log(result))
  .catch((err) => console.log(err));

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
    
  },
  age: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    validate(value) {
      if (value.includes("password"))
        throw new Error('The value should not include "password"');
    },
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
    validate: async function (value) {
      if (!validator.isEmail(value)) {
        throw new Error("Error: the input should be an email");
      }
    },
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  console.log(user);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// const uniqueValidate = async (feildName, value) => {
//   const findOneFilter = {};
//   findOneFilter[feildName] = value;
//   const isUsed = await mongoose
//     .model("Users", userSchema)
//     .findOne(findOneFilter)
//     .countDocuments();
//   if (isUsed) {
//     throw new Error(`Error: the ${feildName} already used`);
//   }
// };

userSchema.statics.findByCredentials = async (email, password) => {
  console.log(email, password)
  const user = await User.findOne({ email });
  console.log(user)
  if (!user) {
    throw Error("Not registered user!");
  }
  const isValidePass = await bcrypt.compare(password, user.password);
  if (!isValidePass) {
    throw Error("Not a valide password");
  }
  return user;
};
const User = mongoose.model("Users", userSchema);

module.exports = User;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
userSchema.pre("save", async function (next) {
  const user = this;
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
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.TOKEN_SECRET
  );
  user.tokens = await user.tokens.concat({ token });
  user.save();
  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  //this here = Users collection
  const user = await this.findOne({ email });
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

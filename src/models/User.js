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
    lowercase: true,
    validate: async function (value) {
     if(!validator.isEmail(value)) {
        throw new Error("Error: the input should be an email")
      }
     const isUsed = await mongoose.model("User", userSchema).findOne({email: this.email}).countDocuments()
     if(isUsed){
       throw new Error("Error: the email already used");
     }
   
    },
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  console.log(user)
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("Users", userSchema);


module.exports = User;

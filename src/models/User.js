const mongoose = require("mongoose");
const validator = require("validator");


const User = mongoose.model("Users", {
      name: {
        type: String,
        trim: true,
        required: true,
        lowercase:true,
      },
      age: {
        type: Number,
        default: 0
      },
      password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value){
            if(value.includes('password')) throw new Error('The value should not include "password"') 
        }
      },
      email: {
          type: String,
          trim: true,
          lowercase:true,
          validator(value){
            validator.isEmail(value)? console.log('Error! the input should be an email'):
            null
          }
      }
    });

    module.exports = User;

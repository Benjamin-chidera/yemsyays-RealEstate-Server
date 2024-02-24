const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail } = require("validator");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Please enter a valid email"],
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: [7, "minimum password length is 7"],
  },
  
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);

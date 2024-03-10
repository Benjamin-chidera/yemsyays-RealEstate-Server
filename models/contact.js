const mongoose = require("mongoose");
const { Schema } = mongoose;
const { isEmail } = require("validator");

const contactSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    name: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("contact", contactSchema);

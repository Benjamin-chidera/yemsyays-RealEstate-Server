const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewsSchema = new Schema(
  {
    property: {
      type: Number,
      max: 5,
    },

    value: {
      type: Number,
      max: 5,
    },

    location: {
      type: Number,
      max: 5,
    },

    support: {
      type: Number,
      max: 5,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    // author: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("review", reviewsSchema);

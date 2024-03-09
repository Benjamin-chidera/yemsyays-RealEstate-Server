const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inspectionSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    inspectionDate: {
      type: Date,
      required: true,
    },
    inspectionTime: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default:
        "https://images.pexels.com/photos/18625018/pexels-photo-18625018/free-photo-of-model-sitting-and-posing-with-arms-crossed-on-beach.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inspection", inspectionSchema);

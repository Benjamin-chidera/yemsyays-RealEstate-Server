const Reviews = require("../models/reviews");

const createReviews = async (req, res) => {
  const { property, value, location, support, message, name, email, author } =
    req.body;

  const { userId } = req.user;

  console.log(req.user);

  req.body.author = userId;

  try {
    const reviews = await Reviews.create({
      name,
      property,
      location,
      support,
      message,
      value,
      email,
      author: userId,
    });
    res.status(201).json({ msg: "successfully created", reviews });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res.status(201).json({
      msg: "successfully gotten",
      NumOfReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

const getAReview = async (req, res) => {
  const { authorId } = req.params;

  try {
    const review = await Reviews.find({ author: authorId }).populate("author");

    if (!review) {
      return res.status(404).json({ err: "Not Found" });
    }

    res.status(200).json({ msg: "successfully", review });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

// const authReview = async (req, res) => {

// }

module.exports = { createReviews, getReviews, getAReview };

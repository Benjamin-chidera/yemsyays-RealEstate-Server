const Reviews = require("../models/reviews");

const createReviews = async (req, res) => {
  try {
    const reviews = await Reviews.create(req.body);
    res.status(201).json({ msg: "successfully created", reviews });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find();
    res
      .status(201)
      .json({
        msg: "successfully gotten",
        NumOfReviews: reviews.length,
        reviews,
      });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};

module.exports = { createReviews, getReviews };

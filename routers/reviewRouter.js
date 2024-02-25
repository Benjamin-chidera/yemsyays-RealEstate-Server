const {
  createReviews,
  getReviews,
} = require("../controllers/reviewController");
const router = require("express").Router();

router.route("/").get(getReviews).post(createReviews);

module.exports = router;

const {
  createReviews,
  getReviews,
  getAReview,
} = require("../controllers/reviewController");
const router = require("express").Router();
const { auth, permission } = require("../middleware/Auth");

router.route("/").get(getReviews).post( auth,createReviews);
router.get("/:authorId", getAReview);

module.exports = router;

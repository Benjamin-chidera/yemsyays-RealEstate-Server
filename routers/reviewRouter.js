const {
  createReviews,
  getReviews,
  // getAReview,
  recentReview,
} = require("../controllers/reviewController");
const router = require("express").Router();
const { auth, permission } = require("../middleware/Auth");

router.route("/").get(getReviews).post(auth, createReviews);
// router.get("/:authorId", getAReview)
router.get("/recent", recentReview);

module.exports = router;

const router = require("express").Router();
const {
  createProperty,
  getProperties,
  getSingleProperty,
  getLatestProperty,
  deleteProperty,
  updateProperty, 
  recentProperties
} = require("../controllers/PropertiesController");

router.get("/latest", getLatestProperty);
router.get("/recent", recentProperties);
router.route("/").post(createProperty).get(getProperties);
router
  .route("/:propertyId")
  .get(getSingleProperty)
  .delete(deleteProperty)
  .patch(updateProperty);

module.exports = router;

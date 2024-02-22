const router = require("express").Router();
const {
  createProperty,
  getProperties,
  getSingleProperty,
  getLatestProperty
} = require("../controllers/PropertiesController");

router.get("/recent", getLatestProperty);
router.route("/").post(createProperty).get(getProperties);
router.route("/:propertyId").get(getSingleProperty)

module.exports = router;

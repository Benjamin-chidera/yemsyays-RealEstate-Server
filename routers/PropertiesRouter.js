const router = require("express").Router();
const {
  createProperty,
  getProperties,
  getSingleProperty,
  getLatestProperty
} = require("../controllers/PropertiesController");

router.route("/").post(createProperty).get(getProperties);
router.route("/:propertyId").get(getSingleProperty)
router.get("/latest", getLatestProperty);

module.exports = router;

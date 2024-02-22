const router = require("express").Router();
const {
  createProperty,
  getProperties,
} = require("../controllers/PropertiesController");

router.route("/").post(createProperty).get(getProperties);

module.exports = router;

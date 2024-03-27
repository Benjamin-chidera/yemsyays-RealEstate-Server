const router = require("express").Router();
const {
  createProperty,
  getProperties,
  getSingleProperty,
  getLatestProperty,
  deleteProperty,
  updateProperty,
  recentProperties,
  updatePropertyStatus,
} = require("../controllers/PropertiesController");
const { auth, permission } = require("../middleware/Auth");

router.get("/latest", getLatestProperty);
router.get("/recent", recentProperties);
router
  .route("/")
  .post(auth, permission("admin"), createProperty)
  .get(getProperties);
router
  .route("/:propertyId")
  .get(auth, getSingleProperty)
  .delete(auth, permission("admin"), deleteProperty)
  .patch(auth, permission("admin"), updateProperty);

router.patch(
  "/propertyStatus/:propertyId",
  auth,
  permission("admin"),
  updatePropertyStatus
);

module.exports = router;

const router = require("express").Router();
const {
  createInspection,
  getInspection,
  deleteInspection,
} = require("../controllers/inspectionController");
const { auth, permission } = require("../middleware/Auth");

router
  .route("/")
  .post(auth, createInspection)
  .get(auth, getInspection);

router.delete("/:inspectionId", auth, permission("admin"), deleteInspection);

module.exports = router;

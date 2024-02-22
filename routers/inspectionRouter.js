const router = require("express").Router();
const {
  createInspection,
  getInspection,
  deleteInspection,
} = require("../controllers/inspectionController");

router.route("/").post(createInspection).get(getInspection);

router.delete("/:inspectionId", deleteInspection);

module.exports = router;

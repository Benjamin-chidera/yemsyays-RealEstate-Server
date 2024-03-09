const router = require("express").Router();
const {
  createInspection,
  getInspection,
  deleteInspection,
  getRecentInspection,
} = require("../controllers/inspectionController");
const { auth, permission } = require("../middleware/Auth");

router
  .route("/")
  .post(auth, permission("user"), createInspection)
  .get(auth, permission("admin"), getInspection);

router.delete("/:inspectionId", auth, permission("admin"), deleteInspection);

router.get("/recent", auth, permission("admin"), getRecentInspection);
module.exports = router;

const router = require("express").Router();
const contact = require("../controllers/contactController");

router.post("/", contact);

module.exports = router;

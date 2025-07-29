const express = require("express");
const {
  setAvailability,
  getAvailability,
} = require("../controllers/profController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/set-availability", authMiddleware, setAvailability);
router.get("/get-availability", authMiddleware, getAvailability);

module.exports = router;

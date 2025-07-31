const express = require("express");
const { checkAvailableSlots } = require("../controllers/studController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/slots/:profId", authMiddleware, checkAvailableSlots);

module.exports = router;

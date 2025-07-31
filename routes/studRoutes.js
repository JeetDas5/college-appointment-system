const express = require("express");
const { checkAvailableSlots,bookAppointment, getMyAppointments } = require("../controllers/studController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/slots/:profId", authMiddleware, checkAvailableSlots);
router.post("/book-appointment", authMiddleware, bookAppointment);
router.get("/my-appointments", authMiddleware, getMyAppointments);

module.exports = router;

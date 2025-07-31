const express = require("express");
const {
  setAvailability,
  getAvailability,
  cancelAppointment,
  getAppointments,
  profAppointments,
} = require("../controllers/profController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/set-availability", authMiddleware, setAvailability);
router.get("/get-availability", authMiddleware, getAvailability);
router.post("/cancel-appointment", authMiddleware, cancelAppointment);
router.get("/get-appointments", authMiddleware, getAppointments);
router.get("/my-appointments", authMiddleware, profAppointments);

module.exports = router;

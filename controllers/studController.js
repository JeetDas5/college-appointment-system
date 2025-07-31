const User = require("../models/User");
const Appointment = require("../models/Appointment");

const checkAvailableSlots = async (req, res) => {
  const role = req.user.role;
  if (role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const prof = await User.findById(req.params.profId);
    if (!prof || prof.role !== "professor") {
      return res.status(404).json({ message: "Professor not found" });
    }
    const bookedSlots = await Appointment.find({
      professor: prof._id,
      status: "confirmed",
    });
    const bookedDates = bookedSlots.map(
      (slot) => slot.date.toISOString().split("T")[0]
    );
    const availableSlots = prof.availability.filter((slot) => {
      return !bookedDates.includes(slot.toISOString().split("T")[0]);
    });
    if (availableSlots.length === 0) {
      return res.status(404).json({
        message: "No available slots found",
        professor: {
          id: prof._id,
          name: prof.name,
          email: prof.email,
        },
      });
    }
    const formattedAvailableSlots = availableSlots.map((slot) => {
      return {
        date: slot.toISOString().split("T")[0],
        time: slot.toTimeString().split(" ")[0],
      };
    });
    res.status(200).json({
      message: "Available slots fetched successfully",
      availableSlots: formattedAvailableSlots,
      professor: {
        id: prof._id,
        name: prof.name,
        email: prof.email,
      },
    });
  } catch (error) {
    console.error("Error checking available slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  checkAvailableSlots,
};

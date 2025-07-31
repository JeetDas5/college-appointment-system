const User = require("../models/User");
const Appointment = require("../models/Appointment");

const checkAvailableSlots = async (req, res) => {
  const role = req.user.role;
  if (role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { profId } = req.params;
    const prof = await User.findById(profId);
    if (!prof || prof.role !== "professor") {
      return res.status(404).json({ message: "Professor not found" });
    }

    const appointments = await Appointment.find({
      professor: prof._id,
      status: "confirmed",
    });

    const bookedSlots = appointments.map((appointment) =>
      appointment.timeSlot.toISOString()
    );

    // Filter out the professor's availability slots that are already booked and if they are in the past
    const currentDate = new Date();

    const availableSlots = prof.availability.filter(
      (slot) => !bookedSlots.includes(slot.toISOString()) && slot > currentDate
    );

    const formattedAvailableSlots = availableSlots.map((slot) => {
      return {
        date: slot.toISOString().split("T")[0],
        time: slot.toTimeString().split(" ")[0],
      };
    });

    res.status(200).json({
      message: "Available slots fetched successfully",
      professor: {
        id: prof._id,
        name: prof.name,
        email: prof.email,
      },
      availableSlots: formattedAvailableSlots,
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const bookAppointment = async (req, res) => {
  //   timeSlot: {
  //     type: Date,
  //     required: true,
  //   },
  const role = req.user.role;
  if (role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { profId, date, time } = req.body;
    const prof = await User.findById(profId);
    if (!prof || prof.role !== "professor") {
      return res.status(404).json({ message: "Professor not found" });
    }

    const timeSlot = new Date(`${date}T${time}`);
    if (isNaN(timeSlot.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    const existingAppointment = await Appointment.findOne({
      professor: prof._id,
      timeSlot: timeSlot,
      status: "confirmed",
    });
    if (existingAppointment) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    const newAppointment = new Appointment({
      student: req.user._id,
      professor: prof._id,
      timeSlot: timeSlot,
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: {
        id: newAppointment._id,
        student: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
        professor: {
          id: prof._id,
          name: prof.name,
          email: prof.email,
        },
        timeSlot: newAppointment.timeSlot.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyAppointments = async (req, res) => {
  const role = req.user.role;
  if (role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const appointments = await Appointment.find({ student: req.user._id })
      .populate("professor", "name email")
      .populate("student", "name email");
    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  checkAvailableSlots,
  bookAppointment,
  getMyAppointments,
};

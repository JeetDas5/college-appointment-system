const Appointment = require("../models/Appointment");
const user = require("../models/User");

const setAvailability = async (req, res) => {
  const role = req.user.role;

  if (role !== "professor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { availability } = req.body;
  if (!availability || !Array.isArray(availability)) {
    return res.status(400).json({ message: "Invalid availability data" });
  }

  try {
    const userData = await user.findById(req.user._id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAvailability = availability.map((date) => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
      return parsedDate;
    });
    const existingDates = userData.availability.map(
      (date) => date.toISOString().split("T")[0]
    );
    const isDateInExisting = newAvailability.some((date) =>
      existingDates.includes(date.toISOString().split("T")[0])
    );
    if (isDateInExisting) {
      return res.status(400).json({
        message: "You have already set availability for some dates",
      });
    }
    const filteredAvailability = newAvailability.filter(
      (date) =>
        !existingDates.includes(date.toISOString().split("T")[0]) &&
        date > new Date()
    );
    userData.availability = [...userData.availability, ...filteredAvailability];
    await userData.save();
    res.status(200).json({
      message: "Availability set successfully",
      availability: userData.availability.map((date) => ({
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().split(" ")[0],
      })),
    });
  } catch (error) {
    console.error("Error setting availability:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAvailability = async (req, res) => {
  const role = req.user.role;

  if (role !== "professor") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const userData = await user.findById(req.user._id).select("availability");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userData.availability || userData.availability.length === 0) {
      return res.status(404).json({
        message: "You have not set any availability",
        availability: [],
      });
    }

    const formattedAvailibility = userData.availability.map((date) => {
      return {
        date: date.toISOString().split("T")[0],
        time: date.toTimeString().split(" ")[0],
      };
    });

    res.status(200).json({
      message: "Availability fetched successfully",
      id: userData._id,
      availability: formattedAvailibility,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAppointments = async (req, res) => {
  const role = req.user.role;

  if (role !== "professor") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const appointments = await Appointment.find({ professor: req.user._id })
      .populate("student", "name email")
      .sort({ date: -1 });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "You have no appointments" });
    }

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelAppointment = async (req, res) => {
  const role = req.user.role;

  if (role !== "professor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { appointmentId } = req.body;
  if (!appointmentId) {
    return res.status(400).json({ message: "Appointment ID is required" });
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  if (appointment.professor.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You can only cancel your own appointments" });
  }
  if (appointment.status !== "confirmed") {
    return res
      .status(400)
      .json({ message: "Appointment is already cancelled" });
  }

  try {
    await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Appointment cancelled successfully" }, appointment);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const profAppointments = async (req, res) => {
  const role = req.user.role;

  if (role !== "professor") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const appointments = await Appointment.find({
      professor: req.user._id,
      status: "confirmed",
      timeSlot: { $gte: new Date() },
    })
      .populate("student", "name email")
      .sort({ date: -1 });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "You have no appointments" });
    }
    appointments.sort((a, b) => b.timeSlot - a.timeSlot);

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments: {
        appointments: appointments.map((appointment) => ({
          id: appointment._id,
          student: {
            id: appointment.student._id,
            name: appointment.student.name,
            email: appointment.student.email,
          },
          profId: appointment.professor._id,
          timeSlot: {
            date: appointment.timeSlot.toISOString().split("T")[0],
            time: appointment.timeSlot.toTimeString().split(" ")[0],
          },
          status: appointment.status,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  setAvailability,
  getAvailability,
  getAppointments,
  cancelAppointment,
  profAppointments,
};

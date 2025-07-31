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
    const updatedUser = await user.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Availability of the professor updated successfully",
      availability: updatedUser.availability,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Server error" });
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
          timeSlot: appointment.timeSlot.toISOString(),
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

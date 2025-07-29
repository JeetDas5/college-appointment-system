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

    res.status(200).json({
      message: "Availability fetched successfully",
      availability: userData.availability,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  setAvailability,
  getAvailability,
};

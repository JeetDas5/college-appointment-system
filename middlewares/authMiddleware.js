const jwt = require("jsonwebtoken");
const user = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await user.findById(decoded.id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

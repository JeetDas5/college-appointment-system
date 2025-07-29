const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if ((!name || !email || !password, !role)) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const existingUser = await user.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await user.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: generateToken(newUser._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const existingUser = await user.findOne({ email });

  if (!existingUser) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    _id: existingUser._id,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    token: generateToken(existingUser._id),
  });
};

module.exports = {
  generateToken,
  register,
  login,
};

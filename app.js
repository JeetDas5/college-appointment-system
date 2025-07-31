const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes.js");
const profRoutes = require("./routes/profRoutes.js");
const studRoutes = require("./routes/studRoutes.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/prof", profRoutes);
app.use("/api/stud", studRoutes);

module.exports = app;

const express = require("express");
const app = express();
const sample = require("./routes/sample.js");
const authRoutes = require("./routes/authRoutes.js");
const profRoutes = require("./routes/profRoutes.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/sample", sample);
app.use("/api/auth", authRoutes);
app.use("/api/prof", profRoutes);

module.exports = app;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/mail", require("./routes/mail.routes"));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

module.exports = app;

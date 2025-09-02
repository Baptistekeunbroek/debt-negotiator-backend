require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const calculateRoutes = require("./routes/calculate");
const outcomeRoutes = require("./routes/outcome");
const userRoutes = require("./routes/info");

const app = express();
app.use(bodyParser.json());

app.use("/calculate-proposal", calculateRoutes);
app.use("/send-outcome", outcomeRoutes);
app.use("/info", userRoutes);

app.get("/", (req, res) => {
  res.send("Debt Negotiator Backend is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

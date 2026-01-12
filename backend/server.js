const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const promptRoutes = require("./routes/promptRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "https://your-frontend-name.onrender.com",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/prompt", promptRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

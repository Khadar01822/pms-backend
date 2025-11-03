// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local frontend
      "https://pms-frontend-ztfs.onrender.com", // deployed frontend URL
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
const maintenanceRoutes = require("./routes/maintenance.routes");
const tenantsRoutes = require("./routes/tenants.routes");
const apartmentsRoutes = require("./routes/apartments.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const paymentsRoutes = require("./routes/payments.routes");

app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/tenants", tenantsRoutes);
app.use("/api/apartments", apartmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentsRoutes);

// ✅ Root route (for Render and local)
app.get("/", (req, res) => {
  res.send("✅ PMS Backend API is live and running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV}`)
);

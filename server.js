// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev (Vite)
      "https://pms-frontend.onrender.com", // ✅ your Render frontend URL (update after deploy)
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Import routes
const maintenanceRoutes = require("./routes/maintenance.routes");
const tenantsRoutes = require("./routes/tenants.routes");
const apartmentsRoutes = require("./routes/apartments.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const paymentsRoutes = require("./routes/payments.routes");

// ✅ Use routes with /api prefix
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/tenants", tenantsRoutes);
app.use("/api/apartments", apartmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentsRoutes);

// ✅ Serve frontend (only in production)
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("PMS API is running...");
  });
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV}`)
);

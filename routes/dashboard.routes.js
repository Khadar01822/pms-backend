// routes/dashboard.routes.js
const express = require("express");
const router = express.Router();
const dashboardCtrl = require("../controllers/dashboard.controller");

// GET /api/dashboard/summary
router.get("/summary", dashboardCtrl.getSummary);

// GET /api/dashboard/monthly-payments?year=2025
router.get("/monthly-payments", dashboardCtrl.getMonthlyPayments);

module.exports = router;

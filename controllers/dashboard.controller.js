// backend/controllers/dashboard.controller.js
const Apartment = require("../models/Apartment");
const Tenant = require("../models/Tenant");
const Payment = require("../models/Payment");
const Maintenance = require("../models/Maintenance");

async function getSummary(req, res) {
  try {
    // total apartments (count documents)
    const totalApartments = await Apartment.countDocuments();

    // available apartments = status: 'vacant'
    const availableUnits = await Apartment.countDocuments({ status: "vacant" });

    // total tenants (count tenant docs)
    const totalTenants = await Tenant.countDocuments();

    // total payments (sum of amounts) only for existing payments
    const paymentsAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalPayments = paymentsAgg.length > 0 ? paymentsAgg[0].total : 0;

    // active maintenance (pending, in_progress)
    const activeMaintenance = await Maintenance.countDocuments({
      status: { $in: ["pending", "in_progress"] },
    });

    // return numeric values (frontend can format to KSH)
    return res.json({
      apartments: totalApartments,
      availableUnits,
      tenants: totalTenants,
      payments: totalPayments,
      maintenance: activeMaintenance,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    return res.status(500).json({ message: "Failed to load dashboard summary" });
  }
}

/**
 * monthly payments endpoint:
 * accepts optional query ?year=2025 (default current year)
 * returns array of { month: 'Jan', total: 12345 } for months 1..12 (zero totals included)
 */
async function getMonthlyPayments(req, res) {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    // aggregate payments grouped by month for the chosen year
    const payments = await Payment.aggregate([
      {
        $match: {
          datePaid: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lte: new Date(`${year}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$datePaid" } },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Build full 12-month array (so chart always has all months)
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    // convert aggregator into map monthIndex -> total
    const totalsByMonth = {};
    payments.forEach((p) => {
      const m = p._id.month; // 1..12
      totalsByMonth[m] = p.total;
    });

    const formatted = monthNames.map((name, idx) => {
      const monthIndex = idx + 1;
      return {
        month: name,
        total: totalsByMonth[monthIndex] ? totalsByMonth[monthIndex] : 0,
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error("Monthly payments error:", err);
    return res.status(500).json({ message: "Failed to load monthly payments" });
  }
}

module.exports = {
  getSummary,
  getMonthlyPayments,
};

// backend/controllers/payments.controller.js
const Payment = require("../models/Payment");

// ✅ Get all payments
const getAll = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("tenant", "name phone")
      .populate("apartment", "unit rent");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get one payment
const getOne = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("tenant", "name phone")
      .populate("apartment", "unit rent");

    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Create a payment
const create = async (req, res) => {
  try {
    const { tenant, apartment, amount, month, paymentMethod, datePaid } = req.body;

    if (!tenant || !apartment || !amount || !month) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = new Payment({
      tenant,
      apartment,
      amount,
      month,
      paymentMethod,
      datePaid: datePaid || new Date(),
    });

    const savedPayment = await payment.save();

    // ✅ populate after saving
    const populated = await Payment.findById(savedPayment._id)
      .populate("tenant", "name phone")
      .populate("apartment", "unit rent");

    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Payment creation error:", err);
    res.status(400).json({ message: err.message });
  }
};

// ✅ Update payment
const update = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("tenant", "name phone")
      .populate("apartment", "unit rent");

    if (!updated) return res.status(404).json({ message: "Payment not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete payment
const remove = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Export all functions properly
module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

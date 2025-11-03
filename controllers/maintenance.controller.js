// controllers/maintenance.controller.js
const Maintenance = require("../models/Maintenance");

// ✅ Get active (pending or in progress) maintenance requests
exports.getActive = async (req, res) => {
  try {
    const list = await Maintenance.find({
      status: { $in: ["pending", "in_progress"] },
    })
      .populate("tenant", "name")
      .populate("apartment", "unit")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error("getActive error:", err);
    res.status(500).json({ message: "Server error loading active maintenance" });
  }
};

// ✅ Get completed (fixed) maintenance requests
exports.getCompleted = async (req, res) => {
  try {
    const list = await Maintenance.find({ status: "fixed" })
      .populate("tenant", "name")
      .populate("apartment", "unit")
      .sort({ updatedAt: -1 });

    res.json(list);
  } catch (err) {
    console.error("getCompleted error:", err);
    res.status(500).json({ message: "Server error loading completed maintenance" });
  }
};

// ✅ Create a new maintenance request
exports.create = async (req, res) => {
  try {
    const { tenant, apartment, description, amount, status, reportedBy } = req.body;

    if (!description || !tenant || !apartment) {
      return res.status(400).json({ message: "Tenant, apartment, and description are required" });
    }

    const newReq = new Maintenance({
      tenant,
      apartment,
      description,
      amount: amount || 0,
      status: status || "pending",
      reportedBy: reportedBy || "tenant",
    });

    const saved = await newReq.save();
    const populated = await saved.populate([
      { path: "tenant", select: "name" },
      { path: "apartment", select: "unit" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    console.error("create maintenance error:", err);
    res.status(500).json({ message: "Failed to create maintenance request" });
  }
};

// ✅ Update maintenance status or details
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === "fixed") {
      updates.dateResolved = new Date();
    }

    const updated = await Maintenance.findByIdAndUpdate(id, updates, { new: true })
      .populate("tenant", "name")
      .populate("apartment", "unit");

    if (!updated) return res.status(404).json({ message: "Maintenance not found" });

    res.json(updated);
  } catch (err) {
    console.error("update maintenance error:", err);
    res.status(500).json({ message: "Failed to update maintenance request" });
  }
};

// ✅ Remove maintenance record
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Maintenance.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Maintenance not found" });
    res.json({ message: "Maintenance removed" });
  } catch (err) {
    console.error("remove maintenance error:", err);
    res.status(500).json({ message: "Failed to remove maintenance" });
  }
};

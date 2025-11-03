const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment" },
    reportedBy: { type: String, enum: ["tenant", "admin"], default: "tenant" },
    description: { type: String, required: true },
    amount: { type: Number, default: 0 }, // editable cost
    dateReported: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "in_progress", "fixed"],
      default: "pending",
    },
    conclusion: { type: String, default: "" }, // resolution notes
    dateResolved: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);

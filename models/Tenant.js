const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    idNumber: String,
    moveInDate: Date,
    rentStatus: { type: String, default: "unpaid" },
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", default: null },
    commercial: { type: mongoose.Schema.Types.ObjectId, ref: "Commercial", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tenant", tenantSchema);

const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
  {
    unit: { type: String, required: true, unique: true },
    floor: { type: Number, default: 1 },
    rent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["vacant", "occupied", "inactive"],
      default: "vacant",
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Apartment", apartmentSchema);

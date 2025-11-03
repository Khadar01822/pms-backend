const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
  {
    unit: { type: String, required: true, unique: true }, // e.g. "1-A"
    floor: { type: Number, required: true },              // 1,2,3
    rent: { type: Number, required: true },               // default 50000
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

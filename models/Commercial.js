// backend/models/Commercial.js
const mongoose = require("mongoose");

const CommercialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    tenant: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
      rent: { type: Number },
      startDate: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commercial", CommercialSchema);

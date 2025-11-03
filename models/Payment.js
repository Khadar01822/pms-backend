const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", default: null },
    commercial: { type: mongoose.Schema.Types.ObjectId, ref: "Commercial", default: null },
    amount: Number,
    month: String,
    paymentMethod: String,
    datePaid: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);



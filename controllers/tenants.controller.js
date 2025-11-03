const asyncHandler = require("express-async-handler");
const Tenant = require("../models/Tenant");
const Apartment = require("../models/Apartment");

// ==========================
// GET all tenants
// ==========================
const getAll = asyncHandler(async (req, res) => {
  const tenants = await Tenant.find().populate("apartment");
  res.json(tenants);
});

// ==========================
// GET single tenant
// ==========================
const getOne = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id).populate("apartment");
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });
  res.json(tenant);
});

// ==========================
// CREATE tenant manually (optional use)
// ==========================
const create = asyncHandler(async (req, res) => {
  const { name, phone, email, idNumber, moveInDate, apartmentId } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "Name and phone are required" });
  }

  let apartment = null;
  if (apartmentId) {
    apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    if (apartment.status === "occupied") {
      return res
        .status(400)
        .json({ message: "Apartment already has a tenant" });
    }
  }

  // Create tenant
  const tenant = await Tenant.create({
    name,
    phone,
    email,
    idNumber,
    moveInDate,
    apartment: apartment ? apartment._id : null,
    rentStatus: "unpaid",
  });

  // Link tenant to apartment (if provided)
  if (apartment) {
    apartment.tenant = tenant._id;
    apartment.status = "occupied";
    await apartment.save();
  }

  res.status(201).json(tenant);
});

// ==========================
// UPDATE tenant
// ==========================
const update = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  const allowed = [
    "name",
    "phone",
    "email",
    "idNumber",
    "moveInDate",
    "rentStatus",
  ];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) tenant[key] = req.body[key];
  });

  await tenant.save();
  const updated = await Tenant.findById(tenant._id).populate("apartment");
  res.json(updated);
});

// ==========================
// DELETE tenant
// ==========================
const remove = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  // Unlink tenant from apartment
  if (tenant.apartment) {
    const apartment = await Apartment.findById(tenant.apartment);
    if (apartment) {
      apartment.tenant = null;
      apartment.status = "vacant";
      await apartment.save();
    }
  }

  await Tenant.deleteOne({ _id: tenant._id });
  res.json({ message: "Tenant removed successfully" });
});

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

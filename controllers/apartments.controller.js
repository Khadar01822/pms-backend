const asyncHandler = require("express-async-handler");
const Apartment = require("../models/Apartment");
const Tenant = require("../models/Tenant");

// ==========================
// GET all apartments
// ==========================
const getAll = asyncHandler(async (req, res) => {
  const list = await Apartment.find().populate("tenant");
  res.json(list);
});

// ==========================
// GET single apartment
// ==========================
const getOne = asyncHandler(async (req, res) => {
  const apt = await Apartment.findById(req.params.id).populate("tenant");
  if (!apt) return res.status(404).json({ message: "Apartment not found" });
  res.json(apt);
});

// ==========================
// CREATE apartment
// ==========================
const create = asyncHandler(async (req, res) => {
  const { unit, floor, rent, status } = req.body;

  if (!unit || !floor) return res.status(400).json({ message: "Unit & floor are required" });

  const exists = await Apartment.findOne({ unit });
  if (exists) return res.status(400).json({ message: "Apartment unit already exists" });

  const created = await Apartment.create({
    unit,
    floor,
    rent: rent ?? 0,
    status: status ?? "vacant",
  });

  res.status(201).json(created);
});

// ==========================
// UPDATE apartment
// ==========================
const update = asyncHandler(async (req, res) => {
  const apt = await Apartment.findById(req.params.id);
  if (!apt) return res.status(404).json({ message: "Apartment not found" });

  const allowed = ["unit", "floor", "rent", "status", "tenant"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) apt[key] = req.body[key];
  });

  if (req.body.tenant !== undefined) apt.status = req.body.tenant ? "occupied" : "vacant";

  await apt.save();
  const updated = await Apartment.findById(apt._id).populate("tenant");
  res.json(updated);
});

// ==========================
// DELETE apartment
// ==========================
const remove = asyncHandler(async (req, res) => {
  const apt = await Apartment.findById(req.params.id);
  if (!apt) return res.status(404).json({ message: "Apartment not found" });

  if (apt.tenant) await Tenant.deleteOne({ _id: apt.tenant });
  await Apartment.deleteOne({ _id: apt._id });
  res.json({ message: "Apartment removed successfully" });
});

// ==========================
// ADD tenant to apartment
// ==========================
const addTenantToApartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, idNumber, moveInDate } = req.body;

  const apartment = await Apartment.findById(id);
  if (!apartment) return res.status(404).json({ message: "Apartment not found" });

  // If already occupied, prevent adding another tenant
  if (apartment.status === "occupied" && apartment.tenant) {
    return res.status(400).json({ message: "This unit is already occupied" });
  }

  // Create tenant
  const tenant = await Tenant.create({
    name,
    phone,
    email,
    idNumber,
    moveInDate,
    apartment: apartment._id,
    rentStatus: "unpaid",
  });

  // Link tenant to apartment
  apartment.tenant = tenant._id;
  apartment.status = "occupied";
  apartment.rent = apartment.rent || 50000;
  await apartment.save();

  const updated = await Apartment.findById(id).populate("tenant");
  res.status(200).json({ message: "Tenant successfully added", apartment: updated, tenant });
});

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  addTenantToApartment,
};

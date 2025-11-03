require("dotenv").config();
const mongoose = require("mongoose");
const Apartment = require("../models/Apartment");
const connectDB = require("../config/db");

const seedApartments = async () => {
  try {
    await connectDB();

    // Remove old apartments
    await Apartment.deleteMany({});
    console.log("🗑️ Old apartments removed");

    const apartments = [
      { unit: "1-A", floor: 1, rent: 50000, status: "vacant" },
      { unit: "1-B", floor: 1, rent: 50000, status: "vacant" },
      { unit: "2-A", floor: 2, rent: 50000, status: "vacant" },
      { unit: "2-B", floor: 2, rent: 50000, status: "vacant" },
      { unit: "3-A", floor: 3, rent: 50000, status: "vacant" },
      { unit: "3-B", floor: 3, rent: 50000, status: "vacant" },
    ];

    await Apartment.insertMany(apartments);
    console.log("✅ Apartments seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedApartments();

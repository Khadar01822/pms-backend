require("dotenv").config();
const mongoose = require("mongoose");
const Commercial = require("../models/Commercial");
const connectDB = require("../config/db");

const seedCommercial = async () => {
  try {
    await connectDB();

    // 1) Remove old commercial units
    await Commercial.deleteMany({});
    console.log("🗑️ Old commercial units removed");

    // 2) Insert new
    const data = [
      {
        name: "Madrasa",
        floor: "G",
        rent: 0,
        status: "vacant",
      },
      {
        name: "Cafeteria",
        floor: "G",
        rent: 100000,
        status: "vacant", // We insert without tenant initially
      },
    ];

    await Commercial.insertMany(data);
    console.log("✅ Commercial units seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedCommercial();

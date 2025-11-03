// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { register, login, me } = require("../controllers/auth.controller");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", protect, me);

module.exports = router;

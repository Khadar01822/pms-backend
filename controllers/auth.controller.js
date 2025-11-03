const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "change_this_admin_secret";

// Helper - create token
function createToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role || "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
// Admin-only registration: if there are no users, allow creation of first admin
// Otherwise: require adminSecret (ADMIN_SECRET) OR a valid admin JWT in Authorization header
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminSecret } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const usersCount = await User.countDocuments();

  // If no users exist, allow creation of first admin (role forced to 'admin')
  if (usersCount === 0) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "admin" });
    const token = createToken(user);
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  }

  // If adminSecret provided and matches, allow creating an admin user
  if (adminSecret && adminSecret === ADMIN_SECRET) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "admin" });
    const token = createToken(user);
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  }

  // Otherwise require valid admin JWT in Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Admin authorization required" });
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }

  const requestingUser = await User.findById(decoded.id);
  if (!requestingUser || requestingUser.role !== "admin") {
    return res.status(403).json({ message: "Admin privileges required" });
  }

  // create user (role optional)
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role: role || "user" });
  const newToken = createToken(user);
  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: newToken });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email & password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const token = createToken(user);
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

// GET /api/auth/me
// returns current user (protected)
const me = asyncHandler(async (req, res) => {
  // req.user is set by auth middleware
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

module.exports = { register, login, me };

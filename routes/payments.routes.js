// routes/payments.routes.js
const express = require("express");
const router = express.Router();

// ✅ make sure this path is correct
const ctrl = require("../controllers/payments.controller.js");

// ✅ routes
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;

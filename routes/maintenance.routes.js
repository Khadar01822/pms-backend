// routes/maintenance.routes.js
const express = require("express");
const ctrl = require("../controllers/maintenance.controller");
const router = express.Router();

router.get("/active", ctrl.getActive);
router.get("/completed", ctrl.getCompleted);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;

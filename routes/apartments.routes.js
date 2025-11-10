const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/apartments.controller");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// Add tenant to apartment
router.post("/:id/tenant", ctrl.addTenantToApartment);

module.exports = router;

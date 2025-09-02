const express = require("express");
const router = express.Router();
const zUomController = require("../controllers/zUom.controller");

router.post("/create", zUomController.createUom);
router.get("/get", zUomController.getAllUoms);
router.get("/get/:id", zUomController.getUomById);
router.put("/put/:id", zUomController.updateUom);
router.delete("/delete/:id", zUomController.deleteUom);

module.exports = router;

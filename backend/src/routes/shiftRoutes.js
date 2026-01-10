const express = require("express");
const router = express.Router();
const { ZShiftCreate, ZShiftGetAll, ZShiftGetById, ZShiftUpdate, ZShiftDelete } = require('../controllers/zShift.Controller');

router.post("/create", ZShiftCreate);
router.get("/get", ZShiftGetAll);
router.get("/get/:id", ZShiftGetById);
router.put("/put/:id", ZShiftUpdate);
router.delete("/delete/:id", ZShiftDelete);

module.exports = router;

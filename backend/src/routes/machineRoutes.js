const express = require("express");
const router = express.Router();
const { ZMachineCreate, ZMachineGetAll, ZMachineGetById, ZMachineUpdate, ZMachineDelete } = require('../controllers/zMachine.Controller');

router.post("/create", ZMachineCreate);
router.get("/get", ZMachineGetAll);
router.get("/get/:id", ZMachineGetById);
router.put("/put/:id", ZMachineUpdate);
router.delete("/delete/:id", ZMachineDelete);

module.exports = router;

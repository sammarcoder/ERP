const express = require("express");
const router = express.Router();
const { ZEmployeeCreate, ZEmployeeGetAll, ZEmployeeGetById, ZEmployeeUpdate, ZEmployeeDelete } = require('../controllers/zEmployee.Controller');

router.post("/create", ZEmployeeCreate);
router.get("/get", ZEmployeeGetAll);
router.get("/get/:id", ZEmployeeGetById);
router.put("/put/:id", ZEmployeeUpdate);
router.delete("/delete/:id", ZEmployeeDelete);

module.exports = router;

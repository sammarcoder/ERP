const express = require("express");
const router = express.Router();
const { ZDepartmentCreate, ZDepartmentGetAll, ZDepartmentGetById, ZDepartmentUpdate, ZDepartmentDelete } = require('../controllers/zDepartment.Controller');

router.post("/create", ZDepartmentCreate);
router.get("/get", ZDepartmentGetAll);
router.get("/get/:id", ZDepartmentGetById);
router.put("/put/:id", ZDepartmentUpdate);
router.delete("/delete/:id", ZDepartmentDelete);

module.exports = router;

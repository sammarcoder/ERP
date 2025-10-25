const express = require("express");
const router = express.Router();
const { ZsalesManCreate, ZsalesManGetAll, ZsalesManGetById, ZsalesManUpdate, ZsalesManDelete } = require('../controllers/zSalesMan.Controller');


router.post("/create", ZsalesManCreate);
router.get("/get", ZsalesManGetAll);
router.get("/get/:id", ZsalesManGetById);
router.put("/put/:id", ZsalesManUpdate);
router.delete("/delete/:id", ZsalesManDelete);


module.exports = router;
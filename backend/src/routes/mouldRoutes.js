const express = require("express");
const router = express.Router();
const { 
    ZMouldCreate, 
    ZMouldGetAll, 
    ZMouldGetById, 
    ZMouldUpdate, 
    ZMouldDelete 
} = require('../controllers/zMould.Controller');

router.post("/create", ZMouldCreate);
router.get("/get", ZMouldGetAll);
router.get("/get/:id", ZMouldGetById);
router.put("/put/:id", ZMouldUpdate);
router.delete("/delete/:id", ZMouldDelete);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
    ZMouldingCreate,
    ZMouldingGetAll,
    ZMouldingGetById,
    ZMouldingUpdate,
    ZMouldingDelete
} = require('../controllers/zMoulding.Controller');

router.post("/create", ZMouldingCreate);
router.get("/get", ZMouldingGetAll);
router.get("/get/:id", ZMouldingGetById);
router.put("/put/:id", ZMouldingUpdate);
router.delete("/delete/:id", ZMouldingDelete);

module.exports = router;

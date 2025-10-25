const express = require('express');
const router = express.Router();
const {
    createZcurrency,
    getAllZcurrencies,
    getZcurrencyById,
    updateZcurrency,
    deleteZcurrency
} = require('../controllers/zcurrencyController');

router.post("/create", createZcurrency);
router.get("/get", getAllZcurrencies);
router.get("/get/:id", getZcurrencyById);
router.put("/put/:id", updateZcurrency);
router.delete("/delete/:id", deleteZcurrency);

module.exports = router;

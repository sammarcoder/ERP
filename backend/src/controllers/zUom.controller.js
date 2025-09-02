// const Uom = require("../models/uom");
// const Item = require("../models/item");
const { includes } = require('zod');
const db = require('../models');
// const ZItems = require('../models/zItems.model')
const { Uom, ZItems } = db
// Create UOM
exports.createUom = async (req, res) => {
    try {
        const uom = await Uom.create(req.body);
        res.status(201).json(uom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all UOMs with Items
exports.getAllUoms = async (req, res) => {
    try {
        const uoms = await Uom.findAll();
        // const uoms = await Uom.findAll({ include: Item });
        res.json(uoms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get UOM by ID with Items
exports.getUomById = async (req, res) => {
    try {
        const uom = await Uom.findByPk(req.params.id,
            // {
            //     include:[{
            //         model:ZItems, as:'uom1'
            //     }]
            // }
        );
        if (!uom) return res.status(404).json({ error: "Uom not found" });
        res.json(uom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update UOM
exports.updateUom = async (req, res) => {
    try {
        const uom = await Uom.findByPk(req.params.id);
        if (!uom) return res.status(404).json({ error: "Uom not found" });

        await uom.update(req.body);
        res.json(uom);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete UOM
exports.deleteUom = async (req, res) => {
    try {
        const uom = await Uom.findByPk(req.params.id);
        if (!uom) return res.status(404).json({ error: "Uom not found" });

        await uom.destroy();
        res.json({ message: "Uom deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

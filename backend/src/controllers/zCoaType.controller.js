// controllers/zCOATypeController.js
// const { ZCOAType } = require('../models/zControlHead.model');

const  db  = require('../models')
const { ZCOAType } = db
// console.log(ZCoa)
// Create ZCoa
const createZCoa = async (req, res) => {
    const { zType } = req.body;

    if (!zType) {
        return res.status(400).json({ message: "ZType field is required" });
    }

    try {
        const newZCoa = await ZCOAType.create({ zType });

        return res.status(201).json({
            message: "COA Type created successfully",
            data: newZCoa
        });
    } catch (error) {
        return res.status(500).json({ message: "Error creating COA Type", error: error.message });
    }
};

// Get all ZCoas
const getAllZCoa = async (req, res) => {
    try {
        const ZCoas = await ZCOAType.findAll();

        return res.status(200).json(ZCoas);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching COA Types", error: error.message });
    }
};

// Get ZCoa by ID
const getZCoaById = async (req, res) => {
    const { id } = req.params;

    try {
        const ZCoa = await ZCOAType.findByPk(id);

        if (!ZCoa) {
            return res.status(404).json({ message: "COA Type not found" });
        }

        return res.status(200).json(ZCoa);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching COA Type", error: error.message });
    }
};

// Update ZCoa
const updateZCoa = async (req, res) => {
    const { id } = req.params;
    const { zType } = req.body;

    if (!zType) {
        return res.status(400).json({ message: "ZType field is required" });
    }

    try {
        const ZCoa = await ZCOAType.findByPk(id);
        if (!ZCoa) {
            return res.status(404).json({ message: "COA Type not found" });
        }

        ZCoa.zType = zType;
        await ZCoa.save();

        return res.status(200).json({
            message: "COA Type updated successfully",
            data: ZCoa
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating COA Type", error: error.message });
    }
};

// Delete ZCoa
const deleteZCoa = async (req, res) => {
    const { id } = req.params;

    try {
        const ZCoa = await ZCOAType.findByPk(id);
        if (!ZCoa) {
            return res.status(404).json({ message: "COA Type not found" });
        }

        await ZCoa.destroy();
        return res.status(200).json({ message: "COA Type deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting COA Type", error: error.message });
    }
};

module.exports = {
    createZCoa,
    getAllZCoa,
    getZCoaById,
    updateZCoa,
    deleteZCoa
};

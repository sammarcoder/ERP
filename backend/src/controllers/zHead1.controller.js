// controllers/zControlHead1Controller.js
// const { ZControlHead1 } = require('../models/zControlHead.model');
const db = require('../models')
const { ZControlHead1, ZControlHead2 } = db
// const data =  MyModel.findAll({ limit: 1 });




// Create ZControlHead1
const createZControlHead1 = async (req, res) => {
    const { zHead1 } = req.body;
    if (!zHead1) {
        return res.status(400).json({ message: "ZHead1 field is required" });
    }

    try {
        const newZHead1 = await ZControlHead1.create({ zHead1 });
        return res.status(201).json({
            message: "Control Head 1 created successfully",
            data: newZHead1
        });
    } catch (error) {
        return res.status(500).json({ message: "Error creating Control Head 1", error: error.message });
    }
};

// Get all ZControlHead1s
const getAllZControlHead1s = async (req, res) => {
    try {
        const zHead1s = await ZControlHead1.findAll();
        return res.status(200).json(zHead1s);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Control Head 1 records", error: error.message });
    }
};

// Get ZControlHead1 by ID
const getZControlHead1ById = async (req, res) => {
    const { id } = req.params;

    try {
        const zHead1 = await ZControlHead1.findByPk(
            id, {
            include: [{
                model: ZControlHead2,
                as:'Control-Head-2'
            }
            ]
        }

        );
        if (!zHead1) {
            return res.status(404).json({ message: "Control Head 1 not found" });
        }

        return res.status(200).json(zHead1);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Control Head 1", error: error.message });
    }
};

// Update ZControlHead1
const updateZControlHead1 = async (req, res) => {
    const { id } = req.params;
    const { zHead1 } = req.body;

    if (!zHead1) {
        return res.status(400).json({ message: "ZHead1 field is required" });
    }

    try {
        const zHead1Record = await ZControlHead1.findByPk(id);
        if (!zHead1Record) {
            return res.status(404).json({ message: "Control Head 1 not found" });
        }

        zHead1Record.zHead1 = zHead1;
        await zHead1Record.save();

        return res.status(200).json({
            message: "Control Head 1 updated successfully",
            data: zHead1Record
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating Control Head 1", error: error.message });
    }
};

// Delete ZControlHead1
const deleteZControlHead1 = async (req, res) => {
    const { id } = req.params;

    try {
        const zHead1 = await ZControlHead1.findByPk(id);
        if (!zHead1) {
            return res.status(404).json({ message: "Control Head 1 not found" });
        }

        await zHead1.destroy();
        return res.status(200).json({ message: "Control Head 1 deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting Control Head 1", error: error.message });
    }
};

module.exports = {
    createZControlHead1,
    getAllZControlHead1s,
    getZControlHead1ById,
    updateZControlHead1,
    deleteZControlHead1
};

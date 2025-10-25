// controllers/zControlHead2Controller.js
const db = require('../models')
const {ZControlHead2, ZControlHead1} = db
const createZControlHead2 = async (req, res) => {
    const { zHead2, zHead1Id } = req.body;
    
    if (!zHead2 || !zHead1Id) {
        return res.status(400).json({ message: "ZHead2 and zHead1Id fields are required" });
    }

    try {
        // Verify parent record exists
        const parentExists = await ZControlHead1.findByPk(zHead1Id);
        if (!parentExists) {
            return res.status(404).json({ message: "Referenced Control Head 1 not found" });
        }
        
        const newZHead2 = await ZControlHead2.create({ zHead2, zHead1Id });
        
        return res.status(201).json({
            message: "Control Head 2 created successfully",
            data: newZHead2
        });
    } catch (error) {
        return res.status(500).json({ message: "Error creating Control Head 2", error: error.message });
    }
};

// Get all ZControlHead2s
const getAllZControlHead2s = async (req, res) => {
    try {
        const zHead2s = await ZControlHead2.findAll({
            include: [{ model: ZControlHead1 , as:'Control-Head-2'}]
        });
        
        return res.status(200).json(zHead2s);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Control Head 2 records", error: error.message });
    }
};

// Get ZControlHead2 by ID
const getZControlHead2ById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const zHead2 = await ZControlHead2.findByPk(id, {
            include: [{ model: ZControlHead1 }]
        });
        
        if (!zHead2) {
            return res.status(404).json({ message: "Control Head 2 not found" });
        }
        
        return res.status(200).json(zHead2);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Control Head 2", error: error.message });
    }
};

// Update ZControlHead2
const updateZControlHead2 = async (req, res) => {
    const { id } = req.params;
    const { zHead2, zHead1Id } = req.body;
    
    if (!zHead2) {
        return res.status(400).json({ message: "ZHead2 field is required" });
    }
    
    try {
        const zHead2Record = await ZControlHead2.findByPk(id);
        if (!zHead2Record) {
            return res.status(404).json({ message: "Control Head 2 not found" });
        }
        
        // If changing parent, verify new parent exists
        if (zHead1Id && zHead1Id !== zHead2Record.zHead1Id) {
            const parentExists = await ZControlHead1.findByPk(zHead1Id);
            if (!parentExists) {
                return res.status(404).json({ message: "Referenced Control Head 1 not found" });
            }
            zHead2Record.zHead1Id = zHead1Id;
        }
        
        zHead2Record.zHead2 = zHead2;
        await zHead2Record.save();
        
        return res.status(200).json({
            message: "Control Head 2 updated successfully",
            data: zHead2Record
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating Control Head 2", error: error.message });
    }
};

// Delete ZControlHead2
const deleteZControlHead2 = async (req, res) => {
    const { id } = req.params;
    
    try {
        const zHead2 = await ZControlHead2.findByPk(id);
        if (!zHead2) {
            return res.status(404).json({ message: "Control Head 2 not found" });
        }
        
        await zHead2.destroy();
        return res.status(200).json({ message: "Control Head 2 deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting Control Head 2", error: error.message });
    }
};

module.exports = {
    createZControlHead2,
    getAllZControlHead2s,
    getZControlHead2ById,
    updateZControlHead2,
    deleteZControlHead2
};

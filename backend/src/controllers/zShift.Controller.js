const db = require('../models');
const { ZShift } = db;

const ZShiftCreate = async (req, res) => {
    const { name, startTime, endTime } = req.body;
    
    if (!name || !startTime || !endTime) {
        return res.status(400).json({ error: 'Name, startTime, and endTime are required' });
    }
    
    try {
        const newShift = await ZShift.create({ name, startTime, endTime });
        res.status(201).json({ success: true, data: newShift });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZShiftGetAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const { count, rows } = await ZShift.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.status(200).json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZShiftGetById = async (req, res) => {
    const { id } = req.params;
    try {
        const shift = await ZShift.findByPk(id);
        if (!shift) {
            return res.status(404).json({ error: 'Shift not found' });
        }
        res.status(200).json(shift);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZShiftUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, startTime, endTime } = req.body;
    
    try {
        const shift = await ZShift.findByPk(id);
        if (!shift) {
            return res.status(404).json({ error: 'Shift not found' });
        }
        shift.name = name;
        shift.startTime = startTime;
        shift.endTime = endTime;
        await shift.save();
        res.status(200).json({ success: true, data: shift });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZShiftDelete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const shift = await ZShift.findByPk(id);
        if (!shift) {
            return res.status(404).json({ error: 'Shift not found' });
        }
        await shift.destroy();
        res.status(200).json({ success: true, message: 'Shift deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { ZShiftCreate, ZShiftGetAll, ZShiftGetById, ZShiftUpdate, ZShiftDelete };

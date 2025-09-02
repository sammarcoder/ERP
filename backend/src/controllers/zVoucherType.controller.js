// const {ZvoucherType} = require('../models/zVoucherType.model');

const db = require('../models');
const { ZvoucherType } = db


const ZVoucherTypeCreate = async (req, res) => {
    const { vType } = req.body;
    console.log("ZVoucherTypeCreate called with data:", req.body);
    
    if (vType === undefined || vType === null || vType === '') {
        return res.status(400).json({ error: 'Missing Field vType is required' });
    }

    try {
        const newZvoucherType = await ZvoucherType.create({ vType });
        res.status(201).json({ success: true, data: newZvoucherType });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        console.error("Error creating ZVoucherType:", err.message);
    }
}   

const ZVoucherTypeGetAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await ZvoucherType.findAndCountAll({
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
}

const ZVoucherTypeGetById = async (req, res) => {
    const { id } = req.params;
    try {
        const voucherType = await ZvoucherType.findByPk(id);
        if (!voucherType) {
            return res.status(404).json({ error: 'Voucher Type not found' });
        }
        res.status(200).json(voucherType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const ZVoucherTypeUpdate = async (req, res) => {
    const { id } = req.params;
    const { vType } = req.body;

    if (vType === undefined || vType === null || vType === '') {
        return res.status(400).json({ error: 'Missing Field vType is required' });
    }

    try {
        const voucherType = await ZvoucherType.findByPk(id);
        if (!voucherType) {
            return res.status(404).json({ error: 'Voucher Type not found' });
        }
        voucherType.vType = vType;
        await voucherType.save();
        res.status(200).json({ success: true, data: voucherType });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

const ZVoucherTypeDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const voucherType = await ZvoucherType.findByPk(id);
        if (!voucherType) {
            return res.status(404).json({ error: 'Voucher Type not found' });
        }
        await voucherType.destroy();
        res.status(200).json({ success: true, message: 'Voucher Type deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {
    ZVoucherTypeCreate,
    ZVoucherTypeGetAll,
    ZVoucherTypeGetById,
    ZVoucherTypeUpdate,
    ZVoucherTypeDelete
};
const db = require('../models');
const { ZMachine } = db;

const ZMachineCreate = async (req, res) => {
    const { name, function: machineFunction } = req.body;
    
    if (!name || !machineFunction) {
        return res.status(400).json({ error: 'Name and function are required' });
    }
    
    try {
        const newMachine = await ZMachine.create({ name, function: machineFunction });
        res.status(201).json({ success: true, data: newMachine });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZMachineGetAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const { count, rows } = await ZMachine.findAndCountAll({
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

const ZMachineGetById = async (req, res) => {
    const { id } = req.params;
    try {
        const machine = await ZMachine.findByPk(id);
        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }
        res.status(200).json(machine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZMachineUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, function: machineFunction } = req.body;
    
    try {
        const machine = await ZMachine.findByPk(id);
        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }
        machine.name = name;
        machine.function = machineFunction;
        await machine.save();
        res.status(200).json({ success: true, data: machine });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZMachineDelete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const machine = await ZMachine.findByPk(id);
        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }
        await machine.destroy();
        res.status(200).json({ success: true, message: 'Machine deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { ZMachineCreate, ZMachineGetAll, ZMachineGetById, ZMachineUpdate, ZMachineDelete };

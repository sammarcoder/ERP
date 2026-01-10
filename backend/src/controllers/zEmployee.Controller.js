const db = require('../models');
const { ZEmployee, ZDepartment } = db;

const ZEmployeeCreate = async (req, res) => {
    const { employeeName, phone, address, departmentId } = req.body;
    
    if (!employeeName || !phone || !departmentId) {
        return res.status(400).json({ error: 'Employee name, phone, and department are required' });
    }
    
    try {
        const newEmployee = await ZEmployee.create({ employeeName, phone, address, departmentId });
        res.status(201).json({ success: true, data: newEmployee });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZEmployeeGetAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const { count, rows } = await ZEmployee.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{
                model: ZDepartment,
                as: 'department',
                attributes: ['id', 'departmentName', 'departmentCode']
            }]
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

const ZEmployeeGetById = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await ZEmployee.findByPk(id, {
            include: [{
                model: ZDepartment,
                as: 'department',
                attributes: ['id', 'departmentName', 'departmentCode']
            }]
        });
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZEmployeeUpdate = async (req, res) => {
    const { id } = req.params;
    const { employeeName, phone, address, departmentId } = req.body;
    
    try {
        const employee = await ZEmployee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        employee.employeeName = employeeName;
        employee.phone = phone;
        employee.address = address;
        employee.departmentId = departmentId;
        await employee.save();
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZEmployeeDelete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const employee = await ZEmployee.findByPk(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        await employee.destroy();
        res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { ZEmployeeCreate, ZEmployeeGetAll, ZEmployeeGetById, ZEmployeeUpdate, ZEmployeeDelete };

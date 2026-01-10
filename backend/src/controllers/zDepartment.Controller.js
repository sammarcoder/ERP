const db = require('../models');
const { ZDepartment } = db;

const ZDepartmentCreate = async (req, res) => {
    const { departmentName, departmentCode, description, location, managerId, isActive } = req.body;
    
    if (!departmentName || !departmentCode) {
        return res.status(400).json({ error: 'Department name and code are required' });
    }
    
    try {
        const newDepartment = await ZDepartment.create({ 
            departmentName, 
            departmentCode, 
            description, 
            location, 
            managerId, 
            isActive: isActive !== undefined ? isActive : true 
        });
        res.status(201).json({ success: true, data: newDepartment });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZDepartmentGetAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const { count, rows } = await ZDepartment.findAndCountAll({
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

const ZDepartmentGetById = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await ZDepartment.findByPk(id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZDepartmentUpdate = async (req, res) => {
    const { id } = req.params;
    const { departmentName, departmentCode, description, location, managerId, isActive } = req.body;
    
    try {
        const department = await ZDepartment.findByPk(id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        department.departmentName = departmentName;
        department.departmentCode = departmentCode;
        department.description = description;
        department.location = location;
        department.managerId = managerId;
        department.isActive = isActive;
        await department.save();
        res.status(200).json({ success: true, data: department });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZDepartmentDelete = async (req, res) => {
    const { id } = req.params;
    
    try {
        const department = await ZDepartment.findByPk(id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        await department.destroy();
        res.status(200).json({ success: true, message: 'Department deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { ZDepartmentCreate, ZDepartmentGetAll, ZDepartmentGetById, ZDepartmentUpdate, ZDepartmentDelete };

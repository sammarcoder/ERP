// const { ZsalesMan } = require('../models/zSalesMan.model');
// const sequelize = require('../../config/database');

const db = require('../models')
const { ZsalesMan } = db

const ZsalesManCreate = async (req, res) => {
    const { name, city, adress, telephone } = req.body;
    console.log("ZsalesManCreate called with data:", req.body);
    const myObject = { name, city, adress, telephone };
    for (const key in myObject) {
        if (!myObject[key] || myObject[key] === undefined || myObject[key] === null || myObject[key] === '') {
            return res.status(400).json({ error: `Missing Field ${myObject[key]} are required` })
        }
    }
    try {
        const newZsalesMan = ZsalesMan.create({name, city, adress, telephone});
        res.status(201).json({ sucess: true, data:newZsalesMan })
    } catch (err) {
        res.status(500).json({ sucess: false, error: err.message })
        console.error("Error creating ZsalesMan:", err.message);
    }
}

const ZsalesManGetAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await ZsalesMan.findAndCountAll({
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

const ZsalesManGetById = async (req, res) => {
    const { id } = req.params;
    try {
        const salesMan = await ZsalesMan.findByPk(id);
        if (!salesMan) {
            return res.status(404).json({ error: 'Salesman not found' });
        }
        res.status(200).json(salesMan);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const ZsalesManUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, city, adress, telephone } = req.body;
    try {
        const salesMan = await ZsalesMan.findByPk(id
        );
        if (!salesMan) {
            return res.status(404).json({ error: 'Salesman not found' });
        }
        salesMan.name = name;
        salesMan.city = city;
        salesMan.adress = adress;
        salesMan.telephone = telephone;
        await salesMan.save();
        res.status(200).json({ success: true, data: salesMan });
    }

    catch (err) {
        res.status(500).json({ success: false, error: err.message });
        console.error("Error updating ZsalesMan:", err.message);
    }
}

const ZsalesManDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const salesMan = await ZsalesMan.findByPk(id);
        if (!salesMan) {
            return res.status(404).json({ error: 'Salesman not found' });
        }
        await salesMan.destroy();
        res.status(200).json({ success: true, message: 'Salesman deleted successfully'});
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        console.error("Error deleting ZsalesMan:", err.message);
    }   
}
module.exports = { ZsalesManCreate, ZsalesManGetAll, ZsalesManGetById, ZsalesManUpdate, ZsalesManDelete };
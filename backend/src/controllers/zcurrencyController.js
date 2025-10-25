const db = require('../models')
const { Zcurrency } = db

const createZcurrency = async (req, res) => {
    const { currencyName } = req.body;
    console.log("createZcurrency called with data:", req.body);
    
    if (!currencyName || currencyName.trim() === '') {
        return res.status(400).json({ error: "Currency name is required" });
    }

    // Validate length (model has STRING(10))
    if (currencyName.length > 10) {
        return res.status(400).json({ error: "Currency name must be 10 characters or less" });
    }

    try {
        const newZcurrency = await Zcurrency.create({ currencyName: currencyName.trim() });
        res.status(201).json({ success: true, data: newZcurrency });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        console.error("Error creating Zcurrency:", err.message);
    }
}

const getAllZcurrencies = async (req, res) => {
    try {
        const currencies = await Zcurrency.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(currencies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getZcurrencyById = async (req, res) => {
    const { id } = req.params;
    try {
        const currency = await Zcurrency.findByPk(id);
        if (!currency) {
            return res.status(404).json({ error: 'Currency not found' });
        }
        res.status(200).json(currency);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateZcurrency = async (req, res) => {
    const { id } = req.params;
    const { currencyName } = req.body;
    
    if (!currencyName || currencyName.trim() === '') {
        return res.status(400).json({ error: "Currency name is required" });
    }

    if (currencyName.length > 10) {
        return res.status(400).json({ error: "Currency name must be 10 characters or less" });
    }

    try {
        const currency = await Zcurrency.findByPk(id);
        if (!currency) {
            return res.status(404).json({ error: 'Currency not found' });
        }

        currency.currencyName = currencyName.trim();
        await currency.save();
        
        res.status(200).json({ success: true, data: currency });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        console.error("Error updating Zcurrency:", err.message);
    }
}

const deleteZcurrency = async (req, res) => {
    const { id } = req.params;

    try {
        const currency = await Zcurrency.findByPk(id);
        if (!currency) {
            return res.status(404).json({ error: 'Currency not found' });
        }
        
        await currency.destroy();
        res.status(200).json({ success: true, message: 'Currency deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        console.error("Error deleting Zcurrency:", err.message);
    }   
}

module.exports = { 
    createZcurrency, 
    getAllZcurrencies, 
    getZcurrencyById, 
    updateZcurrency, 
    deleteZcurrency 
};

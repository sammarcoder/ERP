const db = require('../models');
const { ZMould, ZMouldOutputMaterial, ZItems } = db;
const sequelize = require('../../config/database');

const ZMouldCreate = async (req, res) => {
    const { name, cycleTime, totalCavities, effectiveCavities, inputMaterialId, outputMaterialIds } = req.body;
    
    // Validation
    if (!name || !cycleTime || !totalCavities || !effectiveCavities || !inputMaterialId) {
        return res.status(400).json({ 
            error: 'Name, cycleTime, totalCavities, effectiveCavities, and inputMaterialId are required' 
        });
    }

    if (effectiveCavities > totalCavities) {
        return res.status(400).json({ 
            error: 'Effective cavities cannot be greater than total cavities' 
        });
    }

    const transaction = await sequelize.transaction();
    
    try {
        // Create the mould
        const newMould = await ZMould.create({ 
            name, 
            cycleTime, 
            totalCavities, 
            effectiveCavities, 
            inputMaterialId 
        }, { transaction });

        // Create output material associations if provided
        if (outputMaterialIds && outputMaterialIds.length > 0) {
            const outputMaterialRecords = outputMaterialIds.map(itemId => ({
                mouldId: newMould.id,
                itemId: itemId
            }));
            await ZMouldOutputMaterial.bulkCreate(outputMaterialRecords, { transaction });
        }

        await transaction.commit();

        // Fetch the complete mould with associations
        const completeMould = await ZMould.findByPk(newMould.id, {
            include: [
                {
                    model: ZItems,
                    as: 'inputMaterial',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }]
                },
                {
                    model: ZItems,
                    as: 'outputMaterials',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }],
                    through: { attributes: [] }
                }
            ]
        });

        res.status(201).json({ success: true, data: completeMould });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZMouldGetAll = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
        const { count, rows } = await ZMould.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                {
                    model: ZItems,
                    as: 'inputMaterial',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }]
                },
                {
                    model: ZItems,
                    as: 'outputMaterials',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }],
                    through: { attributes: [] }
                }
            ],
            distinct: true,
            order: [['id', 'DESC']]
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

const ZMouldGetById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const mould = await ZMould.findByPk(id, {
            include: [
                {
                    model: ZItems,
                    as: 'inputMaterial',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }]
                },
                {
                    model: ZItems,
                    as: 'outputMaterials',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }],
                    through: { attributes: [] }
                }
            ]
        });

        if (!mould) {
            return res.status(404).json({ error: 'Mould not found' });
        }

        res.status(200).json(mould);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZMouldUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, cycleTime, totalCavities, effectiveCavities, inputMaterialId, outputMaterialIds } = req.body;

    if (effectiveCavities > totalCavities) {
        return res.status(400).json({ 
            error: 'Effective cavities cannot be greater than total cavities' 
        });
    }

    const transaction = await sequelize.transaction();
    
    try {
        const mould = await ZMould.findByPk(id);
        
        if (!mould) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Mould not found' });
        }

        // Update mould fields
        mould.name = name;
        mould.cycleTime = cycleTime;
        mould.totalCavities = totalCavities;
        mould.effectiveCavities = effectiveCavities;
        mould.inputMaterialId = inputMaterialId;
        await mould.save({ transaction });

        // Update output materials - delete existing and create new
        if (outputMaterialIds !== undefined) {
            await ZMouldOutputMaterial.destroy({ 
                where: { mouldId: id }, 
                transaction 
            });

            if (outputMaterialIds && outputMaterialIds.length > 0) {
                const outputMaterialRecords = outputMaterialIds.map(itemId => ({
                    mouldId: id,
                    itemId: itemId
                }));
                await ZMouldOutputMaterial.bulkCreate(outputMaterialRecords, { transaction });
            }
        }

        await transaction.commit();

        // Fetch updated mould with associations
        const updatedMould = await ZMould.findByPk(id, {
            include: [
                {
                    model: ZItems,
                    as: 'inputMaterial',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }]
                },
                {
                    model: ZItems,
                    as: 'outputMaterials',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }],
                    through: { attributes: [] }
                }
            ]
        });

        res.status(200).json({ success: true, data: updatedMould });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZMouldDelete = async (req, res) => {
    const { id } = req.params;
    
    const transaction = await sequelize.transaction();
    
    try {
        const mould = await ZMould.findByPk(id);
        
        if (!mould) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Mould not found' });
        }

        // Delete output material associations first (cascade should handle this, but being explicit)
        await ZMouldOutputMaterial.destroy({ 
            where: { mouldId: id }, 
            transaction 
        });

        // Delete the mould
        await mould.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({ success: true, message: 'Mould deleted successfully' });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { 
    ZMouldCreate, 
    ZMouldGetAll, 
    ZMouldGetById, 
    ZMouldUpdate, 
    ZMouldDelete 
};

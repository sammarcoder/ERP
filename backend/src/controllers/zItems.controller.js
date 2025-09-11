// controllers/zItems.controller.js
const { ZItems, ZClassType,Uom } = require('../models');
const { Op } = require('sequelize');

// Create a new item
const createItem = async (req, res) => {
    try {
        const {
            itemName,
            itemClass1,
            itemClass2,
            itemClass3,
            itemClass4,
            skuUOM,
            uom2,
            uom2_qty,
            uom3,
            uom3_qty,
            assessmentUOM,
            weight_per_pcs,
            barCode,
            sellingPrice,
            purchasePricePKR,
            purchasePriceFC,
            assessedPrice,
            hsCode,
            cd,
            ftaCd,
            acd,
            rd,
            salesTax,
            addSalesTax,
            itaxImport,
            furtherTax,
            supplier,
            purchaseAccount,
            salesAccount,
            salesTaxAccount,
            wastageItem,
            isNonInventory
        } = req.body;

        // Basic validation
        if (!itemName) {
            return res.status(400).json({
                success: false,
                message: 'Item name is required'
            });
        }

        // Check if item name already exists
        const existingItem = await ZItems.findOne({
            where: { itemName }
        });

        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: 'Item with this name already exists'
            });
        }

        // Create the item
        const newItem = await ZItems.create({
            itemName,
            itemClass1,
            itemClass2,
            itemClass3,
            itemClass4,
            skuUOM,
            uom2,
            uom2_qty,
            uom3,
            uom3_qty,
            assessmentUOM,
            weight_per_pcs,
            barCode,
            sellingPrice,
            purchasePricePKR,
            purchasePriceFC,
            assessedPrice,
            hsCode,
            cd,
            ftaCd,
            acd,
            rd,
            salesTax,
            addSalesTax,
            itaxImport,
            furtherTax,
            supplier,
            purchaseAccount,
            salesAccount,
            salesTaxAccount,
            wastageItem,
            isNonInventory
        });

        // Fetch the created item with associations
        const itemWithAssociations = await ZItems.findByPk(newItem.id, {
            include: [
                { model: ZClassType, as: 'class1' },
                { model: ZClassType, as: 'class2' },
                { model: ZClassType, as: 'class3' },
                { model: ZClassType, as: 'class4' },
                
            ]
        });

        return res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: itemWithAssociations
        });

    } catch (error) {
        console.error('Error creating item:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating item',
            error: error.message
        });
    }
};

// Get all items
const getAllItems = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', includeClasses = false } = req.query;

        const offset = (page - 1) * limit;

        // Build where clause
        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { itemName: { [Op.like]: `%${search}%` } },
                { barCode: { [Op.like]: `%${search}%` } },
                { hsCode: { [Op.like]: `%${search}%` } }
            ];
        }

        // Build include array
        const includeArray = includeClasses === 'true' ? [
            { model: ZClassType, as: 'class1', attributes: ['id', 'classId', 'className'] },
            { model: ZClassType, as: 'class2', attributes: ['id', 'classId', 'className'] },
            { model: ZClassType, as: 'class3', attributes: ['id', 'classId', 'className'] },
            { model: ZClassType, as: 'class4', attributes: ['id', 'classId', 'className'] }
        ] : [];

        // Get items with pagination
        const { count, rows: items } = await ZItems.findAndCountAll({
            where: whereClause,
            include: includeArray,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: items,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching items:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching items',
            error: error.message
        });
    }
};

// Get single item by ID
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await ZItems.findByPk(id, {
            include: [
                { model: ZClassType, as: 'class1', attributes: ['classId'] },
                { model: ZClassType, as: 'class2', attributes: ['classId'] },
                { model: ZClassType, as: 'class3', attributes: ['classId'] },
                { model: ZClassType, as: 'class4', attributes: ['classId'] },
                {model: Uom , as:'uom1',attributes:['uom'] },
                {model: Uom , as:'uomTwo', attributes:['uom']},
                {model: Uom , as:'uomThree' ,attributes:['uom']}
            ]
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: item
        });

    } catch (error) {
        console.error('Error fetching item:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching item',
            error: error.message
        });
    }
};



// // Get items by multiple class filters
// const getItemsByClassFilters = async (req, res) => {
//     try {
//         const { class1, class2, class3, class4 } = req.query;
        
//         const whereClause = {};
        
//         // Add filters only if values are provided and not 0
//         if (class1 && class1 !== '0') {
//             whereClause.itemClass1 = class1;
//         }
//         if (class2 && class2 !== '0') {
//             whereClause.itemClass2 = class2;
//         }
//         if (class3 && class3 !== '0') {
//             whereClause.itemClass3 = class3;
//         }
//         if (class4 && class4 !== '0') {
//             whereClause.itemClass4 = class4;
//         }

//         const items = await ZItems.findAll({
//             where: whereClause,
//             include: [
//                 { model: ZClassType, as: 'class1', attributes: ['id', 'className'] },
//                 { model: ZClassType, as: 'class2', attributes: ['id', 'className'] },
//                 { model: ZClassType, as: 'class3', attributes: ['id', 'className'] },
//                 { model: ZClassType, as: 'class4', attributes: ['id', 'className'] }
//             ]
//         });

//         return res.status(200).json({
//             success: true,
//             data: items,
//             count: items.length,
//             filters: { class1, class2, class3, class4 }
//         });

//     } catch (error) {
//         console.error('Error fetching items by class filters:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Error fetching items by class filters',
//             error: error.message
//         });
//     }
// };











// In your zItems.controller.js, add this method:
const getItemsByClassFilters = async (req, res) => {
    try {
        const { class1, class2, class3, class4 } = req.query;
        
        const whereClause = {};
        
        // Only add filters if values are provided
        if (class1 && class1 !== '0') whereClause.itemClass1 = class1;
        if (class2 && class2 !== '0') whereClause.itemClass2 = class2;
        if (class3 && class3 !== '0') whereClause.itemClass3 = class3;
        if (class4 && class4 !== '0') whereClause.itemClass4 = class4;

        const items = await ZItems.findAll({
            where: whereClause,
           
        });

        return res.status(200).json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error('Error fetching filtered items:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching filtered items'
        });
    }
};










// Update item
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if item exists
        const item = await ZItems.findByPk(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // If updating item name, check uniqueness
        if (updateData.itemName && updateData.itemName !== item.itemName) {
            const existingItem = await ZItems.findOne({
                where: {
                    itemName: updateData.itemName,
                    id: { [Op.ne]: id }
                }
            });

            if (existingItem) {
                return res.status(400).json({
                    success: false,
                    message: 'Item name already exists'
                });
            }
        }

        // Update the item
        await item.update(updateData);

        // Fetch updated item with associations
        const updatedItem = await ZItems.findByPk(id, {
            include: [
                { model: ZClassType, as: 'class1' },
                { model: ZClassType, as: 'class2' },
                { model: ZClassType, as: 'class3' },
                { model: ZClassType, as: 'class4' }
            ]
        });

        return res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });

    } catch (error) {
        console.error('Error updating item:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating item',
            error: error.message
        });
    }
};

// Delete item
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await ZItems.findByPk(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        await item.destroy();

        return res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting item:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting item',
            error: error.message
        });
    }
};

// Get items by class
const getItemsByClass = async (req, res) => {
    try {
        const { classId, classLevel } = req.params;

        if (!['1', '2', '3', '4'].includes(classLevel)) {
            return res.status(400).json({
                success: false,
                message: 'Class level must be 1, 2, 3, or 4'
            });
        }

        const whereClause = {};
        whereClause[`itemClass${classLevel}`] = classId;

        const items = await ZItems.findAll({
            where: whereClause,
            include: [
                { model: ZClassType, as: `class${classLevel}` }
            ]
        });

        return res.status(200).json({
            success: true,
            data: items,
            count: items.length
        });

    } catch (error) {
        console.error('Error fetching items by class:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching items by class',
            error: error.message
        });
    }
};

// Search items
const searchItems = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const items = await ZItems.findAll({
            where: {
                [Op.or]: [
                    { itemName: { [Op.like]: `%${query}%` } },
                    { barCode: { [Op.like]: `%${query}%` } },
                    { hsCode: { [Op.like]: `%${query}%` } }
                ]
            },
            limit: 20
        });

        return res.status(200).json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error('Error searching items:', error);
        return res.status(500).json({
            success: false,
            message: 'Error searching items',
            error: error.message
        });
    }
};

module.exports = {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem,
    getItemsByClass,
    searchItems,
    getItemsByClassFilters
};

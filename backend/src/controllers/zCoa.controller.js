
const { fr } = require('zod/locales');
const db = require('../models');
const { ZCoa } = db;

// Create ZCoa
const ZCoaCreate = async (req, res) => {
    const {
        acName, ch1Id, ch2Id, coaTypeId, setupName, adress, city,
        personName, mobileNo, taxStatus, ntn, cnic, salesLimit,
        credit, creditDoys, salesMan, isJvBalance,
        discountA, discountB, discountC,
        batch_no,
        isPettyCash,
        // NEW DISCOUNT FIELDS
    } = req.body;

    try {
        const newZCoa = await ZCoa.create({
            acName,
            ch1Id,
            ch2Id,
            coaTypeId,
            setupName,
            adress,
            city,
            personName,
            mobileNo,
            taxStatus,
            ntn,
            cnic,
            salesLimit,
            credit,
            creditDoys,
            salesMan,
            isJvBalance,
            isPettyCash,
            discountA: discountA || 0, // Default to 0 if not provided
            discountB: discountB || 0,
            discountC: discountC || 0,
            batch_no: batch_no || 0,
            Transporter_ID: req.body.Transporter_ID || null,
            freight_crt: req.body.freight_crt || 0.00,
            labour_crt: req.body.labour_crt || 0.00,
            bility_expense: req.body.bility_expense || 0.00,
            other_expense: req.body.other_expense || 0.00,
            foreign_currency: req.body.foreign_currency || null,
            sub_customer: req.body.sub_customer || null,
            sub_city: req.body.sub_city || null,
            str: req.body.str || null
                });

        res.status(201).json({
            success: true,
            message: 'Chart of Account created successfully',
            data: newZCoa
        });
    } catch (error) {
        console.error("Error creating ZCoa:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};

// Get all ZCoa records
const ZCoaGetAll = async (req, res) => {
    try {
        const zCoaRecords = await ZCoa.findAll({
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ],
            order: [['createdAt', 'DESC']] // Order by newest first
        });

        return res.status(200).json({
            success: true, // Fixed typo from 'sucess'
            zCoaRecords
        });
    } catch (error) {
        console.error("Error fetching ZCoa records:", error.message);
        return res.status(500).json({
            success: false,
            err: error.message
        });
    }
};

// Get ZCoa by ID
const ZCoaGetById = async (req, res) => {
    const { id } = req.params;

    try {
        const zCoa = await ZCoa.findByPk(id, {
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ]
        });

        if (!zCoa) {
            return res.status(404).json({
                success: false,
                message: "Chart of Account not found"
            });
        }

        res.status(200).json({
            success: true,
            data: zCoa
        });
    } catch (error) {
        console.error("Error fetching ZCoa:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};

// Update ZCoa
const ZCoaUpdate = async (req, res) => {
    const { id } = req.params;
    const {
        acName, ch1Id, ch2Id, coaTypeId, setupName, adress, city,
        personName, mobileNo, taxStatus, ntn, cnic,
        salesLimit, credit, creditDoys, salesMan, isJvBalance,
        discountA, discountB, discountC, batch_no,
        isPettyCash
        // Transporter_ID,
        // freight_crt,
        // labour_crt,
        // bility_expense,
        // other_expense
        // NEW DISCOUNT FIELDS
    } = req.body;

    try {
        const zCoa = await ZCoa.findByPk(id);

        if (!zCoa) {
            return res.status(404).json({
                success: false,
                message: "Chart of Account not found"
            });
        }

        // Update fields
        await zCoa.update({
            acName,
            ch1Id,
            ch2Id,
            coaTypeId,
            setupName,
            adress,
            city,
            personName,
            mobileNo,
            taxStatus,
            ntn,
            cnic,
            salesLimit,
            credit,
            creditDoys,
            salesMan,
            isJvBalance,
            isPettyCash,
            discountA: discountA !== undefined ? discountA : zCoa.discountA,
            discountB: discountB !== undefined ? discountB : zCoa.discountB,
            discountC: discountC !== undefined ? discountC : zCoa.discountC,
            batch_no,
            Transporter_ID: req.body.Transporter_ID || null,
            freight_crt: req.body.freight_crt || 0.00,
            labour_crt: req.body.labour_crt || 0.00,
            bility_expense: req.body.bility_expense || 0.00,
            other_expense: req.body.other_expense || 0.00,
             foreign_currency: req.body.foreign_currency || null,
            sub_customer: req.body.sub_customer || null,
            sub_city: req.body.sub_city || null,
            str: req.body.str || null
            // Transporter_ID: Transporter_ID !== undefined ? Transporter_ID : zCoa.Transporter_ID,
            // freight_crt: freight_crt !== undefined ? freight_crt : zCoa.freight_crt,
            // labour_crt: labour_crt !== undefined ? labour_crt : zCoa.labour_crt,
            // bility_expense: bility_expense !== undefined ? bility_expense : zCoa.bility_expense,
            // other_expense: other_expense !== undefined ? other_expense : zCoa.other_expense
        });

        // Fetch updated record with associations
        const updatedZCoa = await ZCoa.findByPk(id, {
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Chart of Account updated successfully",
            data: updatedZCoa
        });
    } catch (error) {
        console.error("Error updating ZCoa:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};

// Delete ZCoa
const ZCoaDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const zCoa = await ZCoa.findByPk(id);

        if (!zCoa) {
            return res.status(404).json({
                success: false,
                message: "Chart of Account not found"
            });
        }

        await zCoa.destroy();

        res.status(200).json({
            success: true,
            message: "Chart of Account deleted successfully",
            id: id
        });
    } catch (error) {
        console.error("Error deleting ZCoa:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};

const ZCoaGetByCoaTypes = async (req, res) => {
    try {
        const zCoaList = await ZCoa.findAll({
            where: {
                coaTypeId: {
                    [db.Sequelize.Op.in]: [2, 3, 4]
                }
            },
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ]
        });

        if (!zCoaList || zCoaList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Chart of Accounts found for the specified COA types"
            });
        }

        res.status(200).json({
            success: true,
            data: zCoaList,
            count: zCoaList.length
        });
    } catch (error) {
        console.error("Error fetching ZCoa by COA types:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};




const ZCoaGetByCoaTypesCarriage = async (req, res) => {
    try {
        const zCoaList = await ZCoa.findAll({
            where: {
                coaTypeId: {
                    [db.Sequelize.Op.in]: [5]
                }
            },
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ]
        });

        if (!zCoaList || zCoaList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Chart of Accounts found for the specified COA types"
            });
        }

        res.status(200).json({
            success: true,
            data: zCoaList,
            count: zCoaList.length
        });
    } catch (error) {
        console.error("Error fetching ZCoa by COA types:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};








const ZCoaGetByCoaTypesCustomer = async (req, res) => {
    try {
        const zCoaList = await ZCoa.findAll({
            where: {
                coaTypeId: {
                    [db.Sequelize.Op.in]: [1]
                }
            },
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ]
        });

        if (!zCoaList || zCoaList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Chart of Accounts found for the specified COA types"
            });
        }

        res.status(200).json({
            success: true,
            data: zCoaList,
            count: zCoaList.length
        });
    } catch (error) {
        console.error("Error fetching ZCoa by COA types:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};




const ZCoaGetByCoaTypesSupplier = async (req, res) => {
    try {
        const zCoaList = await ZCoa.findAll({
            where: {
                coaTypeId: {
                    [db.Sequelize.Op.in]: [6,7]
                }
            },
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ]
        });

        if (!zCoaList || zCoaList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Chart of Accounts found for the specified COA types"
            });
        }

        res.status(200).json({
            success: true,
            data: zCoaList,
            count: zCoaList.length
        });
    } catch (error) {
        console.error("Error fetching ZCoa by COA types:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};



const ZCoaGetByCoaTypesLc = async (req, res) => {
    try {
        const zCoaList = await ZCoa.findAll({
            where: {
                coaTypeId: {
                    [db.Sequelize.Op.in]: [2]
                }
            },
            include: [
                { model: db.ZControlHead2, required: false },
                { model: db.ZCOAType, required: false }
            ]
        });

        if (!zCoaList || zCoaList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Chart of Accounts found for the specified COA types"
            });
        }

        res.status(200).json({
            success: true,
            data: zCoaList,
            count: zCoaList.length
        });
    } catch (error) {
        console.error("Error fetching ZCoa by COA types:", error.message);
        res.status(500).json({
            success: false,
            err: error.message
        });
    }
};



module.exports = {
    ZCoaCreate,
    ZCoaGetAll,
    ZCoaGetById,
    ZCoaUpdate,
    ZCoaDelete,
    ZCoaGetByCoaTypes,
    ZCoaGetByCoaTypesCarriage,
    ZCoaGetByCoaTypesCustomer,
    ZCoaGetByCoaTypesSupplier
};

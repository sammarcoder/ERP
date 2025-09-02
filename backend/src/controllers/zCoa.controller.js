// // const sequelize = require('../../config/database');
// // const { ZControlHead1, ZControlHead2, ZCOAType } = require('../models/zControlHead.model')
// // const {ZCoa} = require('../models/zCoa.model')

// const db = require('../models');
// const {ZCoa} = db


// const ZCoaCreate = async (req, res) => {
//     const { acName, ch1Id, coaTypeId, setupName, adress, city, personName, mobileNo, taxStatus, ntn, cnic, salesLimit, credit, creditDoys, salesMan, isJvBalance } = req.body;

//     // if (!acName || !ch1Id || !ch2Id || !coaTypeId || !setupName || !adress || !city || !personName || !mobileNo || !taxStatus || !ntn || !cnic || !salesLimit || !credit || !creditDoys || !salesMan || isJvBalance || isJvBalance === undefined || isJvBalance === null) {
//     //     return res.status(400).json({ message: "Missing fields are required" });
//     // }

//     try {
//         const newZCoa = await ZCoa.create({
//             acName,
//             ch1Id,
//             coaTypeId,
//             setupName,
//             adress,
//             city,
//             personName,
//             mobileNo,
//             taxStatus,
//             ntn,
//             cnic,
//             salesLimit,
//             credit,
//             creditDoys,
//             salesMan,
//             isJvBalance
//         });
//         // console.log("New ZCoa created:", newZCoa);
//         res.status(201).json(newZCoa);
//     } catch (error) {
//         console.error("Error creating ZCoa:", error.message);
//         res.status(500).json({err:  error.message  });
//     }
// }


// module.exports =  {ZCoaCreate}


















// const db = require('../models');
// const {ZCoa} = db;

// // Create ZCoa
// const ZCoaCreate = async (req, res) => {
//     const { acName, ch1Id, ch2Id, coaTypeId, setupName, adress, city, personName, mobileNo, taxStatus, ntn, cnic, salesLimit, credit, creditDoys, salesMan, isJvBalance } = req.body;

//     try {
//         const newZCoa = await ZCoa.create({
//             acName,
//             ch1Id,
//             ch2Id,
//             coaTypeId,
//             setupName,
//             adress,
//             city,
//             personName,
//             mobileNo,
//             taxStatus,
//             ntn,
//             cnic,
//             salesLimit,
//             credit,
//             creditDoys,
//             salesMan,
//             isJvBalance
//         });
//         res.status(201).json(newZCoa);
//     } catch (error) {
//         console.error("Error creating ZCoa:", error.message);
//         res.status(500).json({ err: error.message });
//     }
// };

// // Get all ZCoa records
// const ZCoaGetAll = async (req, res) => {
//     try {
//         const zCoaRecords = await ZCoa.findAll({
//             include: [
//                 { model: db.ZControlHead2, required: false },
//                 { model: db.ZCOAType, required: false }
//             ]
//         });
//         return res.status(200).json({sucess:true,zCoaRecords});
//     } catch (error) {
//         console.error("Error fetching ZCoa records:", error.message);
//         return res.status(500).json({ err: error.message });
//     }
// };

// // Get ZCoa by ID
// const ZCoaGetById = async (req, res) => {
//     const { id } = req.params;
    
//     try {
//         const zCoa = await ZCoa.findByPk(id, {
//             include: [
//                 { model: db.ZControlHead2, required: false },
//                 { model: db.ZCOAType, required: false }
//             ]
//         });
        
//         if (!zCoa) {
//             return res.status(404).json({ message: "Chart of Account not found" });
//         }
        
//         res.status(200).json(zCoa);
//     } catch (error) {
//         console.error("Error fetching ZCoa:", error.message);
//         res.status(500).json({ err: error.message });
//     }
// };

// // Update ZCoa
// const ZCoaUpdate = async (req, res) => {
//     const { id } = req.params;
//     const { 
//         acName, ch1Id, ch2Id, coaTypeId, setupName, adress, city, 
//         personName, mobileNo, taxStatus, ntn, cnic, 
//         salesLimit, credit, creditDoys, salesMan, isJvBalance 
//     } = req.body;

//     try {
//         const zCoa = await ZCoa.findByPk(id);
        
//         if (!zCoa) {
//             return res.status(404).json({ message: "Chart of Account not found" });
//         }
        
//         // Update fields
//         await zCoa.update({
//             acName,
//             ch1Id,
//             ch2Id,
//             coaTypeId,
//             setupName,
//             adress,
//             city,
//             personName,
//             mobileNo,
//             taxStatus,
//             ntn,
//             cnic,
//             salesLimit,
//             credit,
//             creditDoys,
//             salesMan,
//             isJvBalance
//         });
        
//         res.status(200).json({
//             message: "Chart of Account updated successfully",
//             data: zCoa
//         });
//     } catch (error) {
//         console.error("Error updating ZCoa:", error.message);
//         res.status(500).json({ err: error.message });
//     }
// };

// // Delete ZCoa
// const ZCoaDelete = async (req, res) => {
//     const { id } = req.params;
    
//     try {
//         const zCoa = await ZCoa.findByPk(id);
        
//         if (!zCoa) {
//             return res.status(404).json({ message: "Chart of Account not found" });
//         }
        
//         await zCoa.destroy();
        
//         res.status(200).json({ 
//             message: "Chart of Account deleted successfully",
//             id: id
//         });
//     } catch (error) {
//         console.error("Error deleting ZCoa:", error.message);
//         res.status(500).json({ err: error.message });
//     }
// };

// module.exports = {
//     ZCoaCreate,
//     ZCoaGetAll,
//     ZCoaGetById,
//     ZCoaUpdate,
//     ZCoaDelete
// };
































const db = require('../models');
const { ZCoa } = db;

// Create ZCoa
const ZCoaCreate = async (req, res) => {
    const { 
        acName, ch1Id, ch2Id, coaTypeId, setupName, adress, city, 
        personName, mobileNo, taxStatus, ntn, cnic, salesLimit, 
        credit, creditDoys, salesMan, isJvBalance,
        discountA, discountB, discountC // NEW DISCOUNT FIELDS
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
            discountA: discountA || 0, // Default to 0 if not provided
            discountB: discountB || 0,
            discountC: discountC || 0
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
        discountA, discountB, discountC // NEW DISCOUNT FIELDS
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
            discountA: discountA !== undefined ? discountA : zCoa.discountA,
            discountB: discountB !== undefined ? discountB : zCoa.discountB,
            discountC: discountC !== undefined ? discountC : zCoa.discountC
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

module.exports = {
    ZCoaCreate,
    ZCoaGetAll,
    ZCoaGetById,
    ZCoaUpdate,
    ZCoaDelete
};

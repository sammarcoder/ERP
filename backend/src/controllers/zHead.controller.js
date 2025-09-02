// const {ZControlHead1, ZControlHead2, ZCOAType} = require('../models/zControlHead.model')


// const ZHeadCreate = async (req, res) =>{
// const {zHead1, zHead2, zType} = req.body
// if(!zHead1 || !zHead2 || !zType){
//     return res.status(400).json({message:"All fields are required"})}

//     const transaction = await sequelize.transaction();
//     try {
//         const zControlHead1 = await ZControlHead1.create({ zHead1 }, { transaction });
//         const zControlHead2 = await ZControlHead2.create({ zHead2, zHead1Id: zControlHead1.id }, { transaction });
//         const zCOAType = await ZCOAType.create({ zType }, { transaction });

//         await transaction.commit();
//         return res.status(201).json({
//             message: "Z Head created successfully",
//             data: {
//                 zControlHead1,
//                 zControlHead2,
//                 zCOAType
//             }
//         });
//     } catch (error) {
//         await transaction.rollback();
//         return res.status(500).json({ message: "Error creating Z Head", error: error.message });
//     }
// }



// const ZHeadGet = async (req, res) => {
//     try {
//         const zHeads = await ZControlHead1.findAll({
//             include: [{
//                 model: ZControlHead2,
//                 as: 'zControlHead2'
//             }, {
//                 model: ZCOAType,
//                 as: 'zCOAType'
//             }]
//         });
//         return res.status(200).json(zHeads);
//     } catch (error) {
//         return res.status(500).json({ message: "Error fetching Z Heads", error: error.message });
//     }
// }



// const ZHeadUpdate = async (req, res) => {
//     const { id } = req.params;
//     const { zHead1, zHead2, zType } = req.body;

//     if (!zHead1 || !zHead2 || !zType) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         const zControlHead1 = await ZControlHead1.findByPk(id);
//         if (!zControlHead1) {
//             return res.status(404).json({ message: "Z Head not found" });
//         }

//         zControlHead1.zHead1 = zHead1;
//         await zControlHead1.save();

//         const zControlHead2 = await ZControlHead2.findOne({ where: { zHead1Id: id } });
//         if (zControlHead2) {
//             zControlHead2.zHead2 = zHead2;
//             await zControlHead2.save();
//         }

//         const zCOAType = await ZCOAType.findOne({ where: { id: id } });
//         if (zCOAType) {
//             zCOAType.zType = zType;
//             await zCOAType.save();
//         }

//         return res.status(200).json({ message: "Z Head updated successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: "Error updating Z Head", error: error.message });
//     }
// }

// const ZHeadDelete = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const zControlHead1 = await ZControlHead1.findByPk(id);
//         if (!zControlHead1) {
//             return res.status(404).json({ message: "Z Head not found" });
//         }

//         await ZControlHead2.destroy({ where: { zHead1Id: id } });
//         await ZCOAType.destroy({ where: { id: id } });
//         await zControlHead1.destroy();

//         return res.status(200).json({ message: "Z Head deleted successfully" });
//     } catch (error) {
//         return res.status(500).json({ message: "Error deleting Z Head", error: error.message });
//     }
// }



// module.exports = {
//     ZHeadCreate,
//     ZHeadGet,
//     ZHeadUpdate,
//     ZHeadDelete
// }





































const { ZControlHead1, ZControlHead2, ZCOAType } = require('../models/zControlHead.model')
const sequelize = require('../../config/database')

// CREATE
// const ZHeadCreate = async (req, res) => {
//     const { zHead1Id, zHead2 ,zType } = req.body
//     if (!zHead1Id || !zHead2 || !zType) {
//         return res.status(400).json({ message: "All fields are required" })
//     }

//     const transaction = await sequelize.transaction()
//     try {
//         // const zControlHead1 = await ZControlHead1.create({ zHead1 }, { transaction })
//         const zControlHead2 = await ZControlHead2.create({ zHead2, zHead1Id }, { transaction })
//         const zCOAType = await ZCOAType.create({ zType }, { transaction })

//         await transaction.commit()
//         return res.status(201).json({
//             message: "Z Head created successfully",
//             data: { zControlHead1, zControlHead2, zCOAType }
//         })
//     } catch (error) {
//         await transaction.rollback()
//         return res.status(500).json({ message: "Error creating Z Head", error: error.message })
//     }
// }



const ZHeadCreate = async (req, res) => {
    const { zHead1Id, zHead2, zType } = req.body;

    if (!zHead1Id || !zHead2 || !zType) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sequelize.transaction();

    try {
        // Example: create all needed records inside the same transaction
        const zControlHead2 = await ZControlHead2.create({ zHead2, zHead1Id }, { transaction });
        const zCOAType = await ZCOAType.create({ zType }, { transaction });

        // Commit ONLY after everything succeeds
        await transaction.commit();

        return res.status(201).json({
            message: "Z Head created successfully",
            data: { zControlHead2, zCOAType }
        });

    } catch (error) {
        // Only rollback if not already finished
        if (!transaction.finished) {
            await transaction.rollback();
        }

        return res.status(500).json({ message: "Error creating Z Head", error: error.message });
    }
};



// GET
const ZHeadGet = async (req, res) => {
    try {
        const zHeads = await ZControlHead1.findAll({
            include: [ZControlHead2] // Only include ZControlHead2, unless you associate ZCOAType
        })
        return res.status(200).json(zHeads)
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Z Heads", error: error.message })
    }
}

// UPDATE
const ZHeadUpdate = async (req, res) => {
    const { id } = req.params
    const { zHead1, zHead2, zType } = req.body

    if (!zHead1 || !zHead2 || !zType) {
        return res.status(400).json({ message: "Missing fields are required" })
    }

    try {
        const zControlHead1 = await ZControlHead1.findByPk(id)
        if (!zControlHead1) {
            return res.status(404).json({ message: "Z Head not found" })
        }

        zControlHead1.zHead1 = zHead1
        await zControlHead1.save()

        const zControlHead2 = await ZControlHead2.findOne({ where: { zHead1Id: id } })
        if (zControlHead2) {
            zControlHead2.zHead2 = zHead2
            await zControlHead2.save()
        }

        const zCOAType = await ZCOAType.findOne({ where: { id: id } })
        if (zCOAType) {
            zCOAType.zType = zType
            await zCOAType.save()
        }

        return res.status(200).json({ message: "Z Head updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Error updating Z Head", error: error.message })
    }
}

// DELETE
const ZHeadDelete = async (req, res) => {
    const { id } = req.params

    try {
        const zControlHead1 = await ZControlHead1.findByPk(id)
        if (!zControlHead1) {
            return res.status(404).json({ message: "Z Head not found" })
        }

        await ZControlHead2.destroy({ where: { zHead1Id: id } })
        await ZCOAType.destroy({ where: { id: id } })
        await zControlHead1.destroy()

        return res.status(200).json({ message: "Z Head deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Error deleting Z Head", error: error.message })
    }
}

module.exports = {
    ZHeadCreate,
    ZHeadGet,
    ZHeadUpdate,
    ZHeadDelete
}
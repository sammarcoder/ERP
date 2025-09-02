// const { JournalDetail } = require('../models/JournalDetail.model');

// const createJournalDetail = async (req, res) => {
//     const { jmId, lineId, coaId, description, chqNo, recieptNo, ownDb, ownCr, rate, amountDb, amountCr, isCost, currencyId, status, } = req.body
//     // console.log(req.body)
//     const myObj = { jmId, lineId, coaId, description, chqNo, recieptNo, ownDb, ownCr, rate, amountDb, amountCr, isCost, currencyId, status };
//     for (const key in myObj) {
//         if (myObj[key] === '' || myObj[key] === undefined || myObj[key] === null) {
//             return res.status(400).json({ sucess: false, message: ` ${myObj[key]} fileds is required` })
//         }
//         console.log(key, myObj[key])
//     }
//     try {
//         const newJournalDetail = await JournalDetail.create({ jmId, lineId, coaId, description, chqNo, recieptNo, ownDb, ownCr, rate, amountDb, amountCr, isCost, currencyId, status })
//         res.status(201).json({ sucess: true, data: newJournalDetail })
//     } catch (err) {
//         console.log(('Error creating Journal Detail:', err.message));
//         res.status(500).json({ success: false, error: err.message });
//     }
// }


// const getAllJournalDetail = async (req, res) => {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;

//     try {
//         const { count, rows } = await JournalDetail.findAndCountAll({
//             limit: parseInt(limit),
//             offset: parseInt(offset)
//         });
//         res.status(200).json({
//             total: count,
//             page: parseInt(page),
//             totalPages: Math.ceil(count / limit),
//             data: rows
//         });
//     } catch (error) {
//         console.error("Error fetching Journal Details:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

// const getJournalDetailById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const journalDetail = await JournalDetail.findByPk(id);
//         if (!journalDetail) {
//             return res.status(404).json({ error: 'Journal Detail not found' });
//         }
//         res.status(200).json(journalDetail);
//     } catch (error) {
//         console.error("Error fetching Journal Detail by ID:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

// const destoryJournalDetailById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const destoryJournalDetailRecord = await JournalDetail.findByPk({
//             where: { id }
//         })
//         if (!destoryJournalDetailRecord) {
//             return res.status(400).json({ sucess: false, message: 'JOurnal Detail Record not found' })
//         }
//         destoryJournalDetailRecord.destory();
//         console.log("Journal Detail Record deleted successfully", destoryJournalDetail);
//         res.status(200).json({ sucess: true, message: 'Recod deleted sucessfully' })

//     } catch (err) {
//         console.error("Error deleting Journal Detail:", err.message);
//         res.status(500).json({ success: false, error: err.message });
//     }
// }


// const updateJournalDetailById = async (req, res) => {
//     {
//         const updateJournalDetaiRecord = await JournalDetail.findByPk({
//             where: { id }
//         })
//         try {
//             if (!updateJournalDetaiRecord) {
//                 return res.status(400).json({ sucess: false, message: 'Journal Detail Record not found' })
//             }
//             const { jmId, linedId, coaId, description, chqNo, recieptNo, ownDb, ownCr, rate, amountDb, amountCr, iscost, currencyId, status } = req.body;
//             const updatedData = {
//                 jmId,
//                 linedId,
//                 coaId,
//                 description,
//                 chqNo,
//                 recieptNo,
//                 ownDb,
//                 ownCr,
//                 rate,
//                 amountDb,
//                 amountCr,
//                 iscost,
//                 currencyId,
//                 status
//             };
//             for (const key in updatedData) {
//                 if (updatedData[key] === '' || updatedData[key] === undefined || updatedData[key] === null) {
//                     return res.status(400).json({ success: false, message: ` ${key} field is required` });
//                 }
//             }
//             await updateJournalDetaiRecord.update(updatedData);
//             console.log("Journal Detail Record updated successfully", updateJournalDetaiRecord);
//         } catch (err) {
//             console.error("Error updating Journal Detail:", err.message);
//             res.status(500).json({ success: false, error: err.message });
//         }
//     }
// }



// module.exports = {
//     createJournalDetail,
//     getAllJournalDetail,
//     destoryJournalDetailById,
//     updateJournalDetailById,
//     getJournalDetailById
// }





















const db = require('../models');
const { JournalDetail } = db;

const createJournalDetail = async (req, res) => {
    const { jmId, lineId, coaId, description, chqNo, recieptNo, ownDb, ownCr, rate, amountDb, amountCr, isCost, currencyId, status } = req.body;
    
    const myObj = { jmId, lineId, coaId, description, chqNo, recieptNo, ownDb, ownCr, rate, amountDb, amountCr, isCost, currencyId, status };
    for (const key in myObj) {
        if (myObj[key] === '' || myObj[key] === undefined || myObj[key] === null) {
            return res.status(400).json({ success: false, message: `${key} field is required` });
        }
    }
    
    try {
        const newJournalDetail = await JournalDetail.create({ 
            jmId, lineId, coaId, description, chqNo, recieptNo, 
            ownDb, ownCr, rate, amountDb, amountCr, isCost, currencyId, status 
        });
        res.status(201).json({ success: true, data: newJournalDetail });
    } catch (err) {
        console.log('Error creating Journal Detail:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
}

const getAllJournalDetail = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await JournalDetail.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.status(200).json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        console.error("Error fetching Journal Details:", error.message);
        res.status(500).json({ error: error.message });
    }
}

const getJournalDetailById = async (req, res) => {
    const { id } = req.params;

    try {
        const journalDetail = await JournalDetail.findByPk(id);
        if (!journalDetail) {
            return res.status(404).json({ error: 'Journal Detail not found' });
        }
        res.status(200).json(journalDetail);
    } catch (error) {
        console.error("Error fetching Journal Detail by ID:", error.message);
        res.status(500).json({ error: error.message });
    }
}

const destroyJournalDetailById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const journalDetailRecord = await JournalDetail.findByPk(id);
        
        if (!journalDetailRecord) {
            return res.status(404).json({ success: false, message: 'Journal Detail Record not found' });
        }
        
        await journalDetailRecord.destroy();
        console.log("Journal Detail Record deleted successfully");
        res.status(200).json({ success: true, message: 'Record deleted successfully' });

    } catch (err) {
        console.error("Error deleting Journal Detail:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
}

const updateJournalDetailById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const updateJournalDetailRecord = await JournalDetail.findByPk(id);
        
        if (!updateJournalDetailRecord) {
            return res.status(404).json({ success: false, message: 'Journal Detail Record not found' });
        }
        
        const { jmId, lineId, coaId, description, chqNo, recieptNo, ownDb, ownCr, rate, amountDb, amountCr, isCost, currencyId, status } = req.body;
        
        const updatedData = {
            jmId,
            lineId,
            coaId,
            description,
            chqNo,
            recieptNo,
            ownDb,
            ownCr,
            rate,
            amountDb,
            amountCr,
            isCost,
            currencyId,
            status
        };
        
        for (const key in updatedData) {
            if (updatedData[key] === '' || updatedData[key] === undefined || updatedData[key] === null) {
                return res.status(400).json({ success: false, message: `${key} field is required` });
            }
        }
        
        await updateJournalDetailRecord.update(updatedData);
        console.log("Journal Detail Record updated successfully");
        res.status(200).json({ success: true, data: updateJournalDetailRecord });
        
    } catch (err) {
        console.error("Error updating Journal Detail:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = {
    createJournalDetail,
    getAllJournalDetail,
    destroyJournalDetailById,
    updateJournalDetailById,
    getJournalDetailById
};

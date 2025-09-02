// const coa = require('../models/coa')



// // exports.createCoa = async (req, res) => {
// //     try {
// //         const { name, type1, type2, calssification } = req.body
// //         const newCoa = await coa.create(req.body)
// //         res.status(201).json(newCoa)
// //     } catch (err) {
// //         res.status(400).json({ error: err.message })
// //     }
// // }









// exports.createCoa = async (req, res) => {
//     try {
//         const { name, type1, type2, classification } = req.body;
//         console.log("Received body:", req.body); 

//         // const { name, type1, type2, classification } = req.body;
//         // Check for duplicate name first
//         const existing = await coa.findOne({ where: { name } });
//         if (existing) {
//             return res.status(400).json({ error: "Name already exists" });
//         }


//         // Create new record
//         const newCoa = await coa.create({
//             name,
//             type1,
//             type2,
//             classification,
//             // serial_no: serialNo
//         });

//         res.status(201).json({
//             message: "Coa created successfully",
//             data: newCoa
//         });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };




// exports.getCoa = async (req, res) => {
//     const { id } = req.params
//     try {
//         const getAllCoa = await coa.findAll()
//         res.status(200).json({ data: getAllCoa })
//     } catch (err) {
//         res.status(400).json({ error: err.messsage })
//     }


// }



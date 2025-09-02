
const { where } = require('sequelize')
const db = require('../models')
const { ZClassType } = db
// console.log(ZClassType === instanceof )
const zUomCreate = async (req, res) => {
    const { className, classId } = req.body
    try {
        const newUom = await ZClassType.create({ className, classId })
        return res.status(201).json({ sucess: true, newUom })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ sucess: false, messaage: err.message })

    }
}


const getAllUom = async (req, res) => {
    const { id } = req.params
    try {
        const uoms = await ZClassType.findAll({
            where:{id}
        })
        return res.status(200).json({ success: true, uoms })
    } catch (err) {
        console.log(err.messaage)
        return res.status(500).json({ sucess: false, messaage: err.message })
    }
}


const getUomById = async (req, res) => {
    const { id } = req.params
    try {
        const uoms = await ZClassType.findByPk(
         id
        )
        return res.status(200).json({ success: true, uoms })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ sucess: false, messaage: err.message })
    }
}


const getByClassID = async(req,res) =>{
    const {classId} = req.params
    try{
        const getByclassID = await ZClassType.findAll({
            where:{classId}
        })
        console.log('this is data of clas Id',getByclassID)
        return res.status(200).json({sucess:true, getByclassID})
    }catch(err){
        return res.status(500).json({sucess: false, message : err.message})   }
}

module.exports = { zUomCreate, getAllUom, getUomById, getByClassID }
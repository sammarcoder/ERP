
const { where } = require('sequelize')
const db = require('../models')
const { ZClassType } = db
// console.log(ZClassType === instanceof )
const zClassCreate = async (req, res) => {
    const { className, classId } = req.body
    try {
        const newClassType = await ZClassType.create({ className, classId })
        return res.status(201).json({ sucess: true, newClassType })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ sucess: false, messaage: err.message })

    }
}


const getAllClassTypes = async (req, res) => {
    const { id } = req.params
    try {
        const classTypes = await ZClassType.findAll({
            where:{id}
        })
        return res.status(200).json({ success: true, classTypes })
    } catch (err) {
        console.log(err.messaage)
        return res.status(500).json({ sucess: false, messaage: err.message })
    }
}


const getClassTypeById = async (req, res) => {
    const { id } = req.params
    try {
        const classTypes = await ZClassType.findByPk(
         id
        )
        return res.status(200).json({ success: true, classTypes })
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
        // console.log('this is data of clas Id',getByclassID)
        return res.status(200).json({sucess:true, getByclassID})
    }catch(err){
        return res.status(500).json({sucess: false, message : err.message})   }
}

const updateClassType = async (req, res) => {
    const { id } = req.params
    const { className, classId } = req.body 
    try {
        const classType = await ZClassType.findByPk(id)
        if (!classType) {
            return res.status(404).json({ sucess: false, message: 'Class Type not found' })
        }
        classType.className = className || classType.className
        classType.classId = classId || classType.classId
        await classType.save()
        return res.status(200).json({ sucess: true, classType })
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ sucess: false, messaage: err.message })
    }

}

module.exports = { zClassCreate, getAllClassTypes, getByClassID, getClassTypeById, updateClassType }
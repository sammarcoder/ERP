const express = require('express');
const router = express.Router()

const { zClassCreate,getAllClassTypes,getClassTypeById, getByClassID, updateClassType } = require('../controllers/zClassType.controller')

// router.post('/create', zUomCreate);
// router.get('/get', getAllUom)
// router.get('/get/:id', getUomById)
// router.get('/get-by-class-id/:classId', getByClassID)

router.post('/create', zClassCreate);
router.get('/get', getAllClassTypes)
router.get('/get/:id', getClassTypeById)
router.get('/get-by-class-id/:classId', getByClassID)
router.put('/update/:id', updateClassType)

module.exports = router





















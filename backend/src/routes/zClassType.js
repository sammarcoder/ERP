const express = require('express');
const router = express.Router()

const { zUomCreate, getAllUom, getUomById, getByClassID } = require('../controllers/zClassType.controller')

router.post('/create', zUomCreate);
router.get('/get', getAllUom)
router.get('/get/:id', getUomById)
router.get('/get-by-class-id/:classId', getByClassID)

module.exports = router
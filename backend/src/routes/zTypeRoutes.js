// routes/zCOATypeRoutes.js
const express = require('express');
const router = express.Router();

const {


    createZCoa,
    getAllZCoa,
    getZCoaById,
    updateZCoa,
    deleteZCoa

} = require('../controllers/zCoaType.controller')
router.post('/', createZCoa);
router.get('/', getAllZCoa);
router.get('/:id', getZCoaById);
router.put('/:id', updateZCoa);
router.delete('/:id', deleteZCoa);

module.exports = router;

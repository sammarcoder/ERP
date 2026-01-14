const db = require('../models');
const { ZMoulding, ZMachine, ZEmployee, ZShift, ZMould, ZItems } = db;

const ZMouldingCreate = async (req, res) => {
    const {
        date,
        machineId,
        operatorId,
        shiftId,
        startTime,
        endTime,
        shutdownElectricity,
        shutdownMachine,
        shutdownNamaz,
        shutdownMould,
        shutdownOther,
        counterOne,
        counterTwo,
        mouldId,
        selectedOutputMaterialId,
        inputQty,
        outputQty,
        qualityCheckerId
    } = req.body;

    // Validation
    if (!date || !machineId || !operatorId || !shiftId || !mouldId || !selectedOutputMaterialId || !qualityCheckerId) {
        return res.status(400).json({
            error: 'Date, machine, operator, shift, mould, output material, and quality checker are required'
        });
    }

    try {
        // Calculate finalCounter
        const finalCounter = (counterTwo || 0) - (counterOne || 0);

        const newMoulding = await ZMoulding.create({
            date,
            machineId,
            operatorId,
            shiftId,
            startTime,
            endTime,
            shutdownElectricity: shutdownElectricity || 0,
            shutdownMachine: shutdownMachine || 0,
            shutdownNamaz: shutdownNamaz || 0,
            shutdownMould: shutdownMould || 0,
            shutdownOther: shutdownOther || 0,
            counterOne: counterOne || 0,
            counterTwo: counterTwo || 0,
            finalCounter,
            mouldId,
            selectedOutputMaterialId,
            inputQty: inputQty || 0,
            outputQty: outputQty || 0,
            qualityCheckerId
        });

        // Fetch complete record with associations
        const completeMoulding = await ZMoulding.findByPk(newMoulding.id, {
            include: getIncludes()
        });

        res.status(201).json({ success: true, data: completeMoulding });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZMouldingGetAll = async (req, res) => {
    const { page = 1, limit = 10, date, machineId, shiftId } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause for filters
    const whereClause = {};
    if (date) whereClause.date = date;
    if (machineId) whereClause.machineId = machineId;
    if (shiftId) whereClause.shiftId = shiftId;

    try {
        const { count, rows } = await ZMoulding.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: getIncludes(),
            order: [['date', 'DESC'], ['id', 'DESC']],
            distinct: true
        });

        res.status(200).json({
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data: rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZMouldingGetById = async (req, res) => {
    const { id } = req.params;

    try {
        const moulding = await ZMoulding.findByPk(id, {
            include: getIncludes()
        });

        if (!moulding) {
            return res.status(404).json({ error: 'Moulding record not found' });
        }

        res.status(200).json(moulding);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const ZMouldingUpdate = async (req, res) => {
    const { id } = req.params;
    const {
        date,
        machineId,
        operatorId,
        shiftId,
        startTime,
        endTime,
        shutdownElectricity,
        shutdownMachine,
        shutdownNamaz,
        shutdownMould,
        shutdownOther,
        counterOne,
        counterTwo,
        mouldId,
        selectedOutputMaterialId,
        inputQty,
        outputQty,
        qualityCheckerId
    } = req.body;

    try {
        const moulding = await ZMoulding.findByPk(id);

        if (!moulding) {
            return res.status(404).json({ error: 'Moulding record not found' });
        }

        // Calculate finalCounter
        const finalCounter = (counterTwo || 0) - (counterOne || 0);

        // Update fields
        moulding.date = date;
        moulding.machineId = machineId;
        moulding.operatorId = operatorId;
        moulding.shiftId = shiftId;
        moulding.startTime = startTime;
        moulding.endTime = endTime;
        moulding.shutdownElectricity = shutdownElectricity || 0;
        moulding.shutdownMachine = shutdownMachine || 0;
        moulding.shutdownNamaz = shutdownNamaz || 0;
        moulding.shutdownMould = shutdownMould || 0;
        moulding.shutdownOther = shutdownOther || 0;
        moulding.counterOne = counterOne || 0;
        moulding.counterTwo = counterTwo || 0;
        moulding.finalCounter = finalCounter;
        moulding.mouldId = mouldId;
        moulding.selectedOutputMaterialId = selectedOutputMaterialId;
        moulding.inputQty = inputQty || 0;
        moulding.outputQty = outputQty || 0;
        moulding.qualityCheckerId = qualityCheckerId;

        await moulding.save();

        // Fetch updated record with associations
        const updatedMoulding = await ZMoulding.findByPk(id, {
            include: getIncludes()
        });

        res.status(200).json({ success: true, data: updatedMoulding });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const ZMouldingDelete = async (req, res) => {
    const { id } = req.params;

    try {
        const moulding = await ZMoulding.findByPk(id);

        if (!moulding) {
            return res.status(404).json({ error: 'Moulding record not found' });
        }

        await moulding.destroy();

        res.status(200).json({ success: true, message: 'Moulding record deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Helper function for includes
function getIncludes() {
    return [
        {
            model: ZMachine,
            as: 'machine',
            attributes: ['id', 'name', 'function']
        },
        {
            model: ZEmployee,
            as: 'operator',
            attributes: ['id', 'employeeName', 'phone']
        },
        {
            model: ZShift,
            as: 'shift',
            attributes: ['id', 'name', 'startTime', 'endTime']
        },
        {
            model: ZMould,
            as: 'mould',
            attributes: ['id', 'name', 'cycleTime', 'totalCavities', 'effectiveCavities', 'inputMaterialId'],
            include: [
                {
                    model: ZItems,
                    as: 'inputMaterial',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }]
                },
                {
                    model: ZItems,
                    as: 'outputMaterials',
                    attributes: ['id', 'itemName'],
                    include: [{ association: 'uom1', attributes: ['id', 'uom'] }],
                    through: { attributes: [] }
                }
            ]
        },
        {
            model: ZItems,
            as: 'selectedOutputMaterial',
            attributes: ['id', 'itemName'],
            include: [{ association: 'uom1', attributes: ['id', 'uom'] }]
        },
        {
            model: ZEmployee,
            as: 'qualityChecker',
            attributes: ['id', 'employeeName', 'phone']
        }
    ];
}

module.exports = {
    ZMouldingCreate,
    ZMouldingGetAll,
    ZMouldingGetById,
    ZMouldingUpdate,
    ZMouldingDelete
};

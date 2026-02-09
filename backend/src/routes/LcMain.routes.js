// // routes/LcMain.routes.js

// // routes/LcMain.routes.js

// const express = require('express');
// const router = express.Router();
// const controller = require('../controllers/LcMain.controller');

// // GET /api/lc-main/get - Get all
// router.get('/get', controller.getAll);

// // ✅ GET /api/lc-main/used-coa-ids - Get used COA IDs
// router.get('/used-coa-ids', controller.getUsedCoaIds);

// // GET /api/lc-main/get/:id - Get by ID
// router.get('/get/:id', controller.getById);

// // POST /api/lc-main/create - Create
// router.post('/create', controller.create);

// // PUT /api/lc-main/put/:id - Update
// router.put('/put/:id', controller.update);

// // DELETE /api/lc-main/delete/:id - Delete
// router.delete('/delete/:id', controller.remove);

// // PUT /api/lc-main/toggle-status/:id - Toggle status
// router.put('/toggle-status/:id', controller.toggleStatus);



// router.get('/get-all-gdn', controller.get_all_gdn);
// router.get('/get-gdn', controller.get_gdn);
// module.exports = router;















// routes/LcMain.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/LcMain.controller');

router.get('/get', controller.getAll);
router.get('/used-coa-ids', controller.getUsedCoaIds);
router.get('/get-all-gdn', controller.get_all_gdn);
router.get('/get-gdn', controller.get_gdn);
router.get('/get/:id', controller.getById);
router.post('/create', controller.create);
router.put('/put/:id', controller.update);
router.patch('/sync-details/:id', controller.syncDetails);
router.delete('/delete/:id', controller.remove);
router.put('/toggle-status/:id', controller.toggleStatus);
router.get('/journal-details', controller.getJournalDetailsByCoa);
router.patch('/update-journal-details', controller.updateJournalDetails);

module.exports = router;

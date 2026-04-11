const express = require('express');
const router = express.Router();

const scannerController = require('../controllers/ScannerController');


router.post('/', scannerController.addAdminScanner);
router.get('/', scannerController.allScanner);
router.put('/update/:id', scannerController.updateScanner);
router.delete("/delete/:id", scannerController.deleteScanner);

module.exports = router;
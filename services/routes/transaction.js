const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const userAuth = require("../middleware/verifyUser")
const varifyAdmin = require("../middleware/varifyAdmin")

// 🆕 Create
router.post('/', userAuth, transactionController.createTransaction);

// 📄 My transactions
router.get('/current', userAuth, transactionController.getMyTransactions);

// 📄 All (admin)
router.get('/all', transactionController.getAllTransactions);

// ✏️ Update
router.put('/update/:id', varifyAdmin, transactionController.updateTransactionStatus);

module.exports = router;
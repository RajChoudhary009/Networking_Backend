const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const userAuth = require("../middleware/verifyUser")
const varifyAdmin = require("../middleware/varifyAdmin")

router.post('/register', userController.createUser);
router.put('/update-user', userAuth, userController.updateUserDetails);
router.post('/login', userController.login);
router.post('/admin/login', userController.adminLogin);
router.get('/logout', userController.logout);

router.post('/current', userAuth,userController.getExitingUsers);
router.get('/tree/:userId', userController.getUserTree);

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);

// 🔹 Forgot Password -> POST /user/forgot-password
router.post("/forgot-password", userController.forgotPassword);

// POST /user/contact
router.post("/send/mail", userController.contactAdmin);

// ✅ DELETE API
router.delete("/delete-user", userController.deleteUserByEmail);

// 🔹 Update User -> POST /user/update
router.post("/update", userController.updateUserByEmail);

router.put("/update/byAdmin/:userId", varifyAdmin, userController.updateUserDetailsByAdmin);

module.exports = router;
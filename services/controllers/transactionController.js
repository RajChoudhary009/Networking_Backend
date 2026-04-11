const { Transaction, User } = require("../models");
const multer = require("multer");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hemankishere@gmail.com";

// 🔥 Multer setup (simple)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });


// 🆕 Create Transaction
const createTransaction = async (req, res) => {
    upload.single("screenshot")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "File upload failed",
                error: err.message
            });
        }

        try {
            const userId = req.user.userId;

            let { amount, paymentMethod, withdrawMethod, type } = req.body;
            let screenshot = req.file ? `uploads/${req.file.filename}` : null;

            const user = await User.findOne({ where: { userId } });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // 🔥 TYPE CHECK
            if (!["deposit", "withdraw"].includes(type)) {
                return res.status(400).json({
                    message: "Withdraw method required (deposit/withdraw)"
                });
            }


            // 💰 DEPOSIT LOGIC
            if (type === "deposit") {

                if (!paymentMethod) {
                    return res.status(400).json({
                        message: "Payment method required for deposit"
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        message: "Screenshot required for deposit"
                    });
                }

                // 🔥 no require for deposite
                withdrawMethod = null;
            }

            // 💸 WITHDRAW LOGIC
            if (type === "withdraw") {

                // ❌ Minimum check
                if (user.wallet < 100) {
                    return res.status(400).json({
                        success: false,
                        message: "Minimum wallet balance should be $100 to withdraw"
                    });
                }

                // ❌ balance check
                if (user.wallet < amount) {
                    return res.status(400).json({
                        message: "Insufficient wallet balance"
                    });
                }

                // ❌ at least ek hona chahiye
                if (!user.paymentAddress && !user.userScanner) {
                    return res.status(400).json({
                        message: "Add payment address OR upload scanner"
                    });
                }

                // 🔥 withdraw fields null in deposit 
                paymentMethod = null;
                screenshot = null;
            }

            // ✅ CREATE TRANSACTION
            const transaction = await Transaction.create({
                userId,
                amount,
                paymentMethod,
                withdrawMethod,
                type,
                screenshot
            });

            return res.status(200).json({
                success: true, message: "Transaction created successfully!", data: transaction
            });

        } catch (error) {
            return res.status(500).json({
                success: false, message: "Server error", error: error.message
            });
        }
    });
};


// 📄 Get My Transactions (logged user)
const getMyTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const transactions = await Transaction.findAll({
            order: [["createdAt", "DESC"]],
            where: { userId: userId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["userId", "name", "email"]
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// 📄 Get All Transactions (admin use)
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: User,
                    as: "user",
                    // attributes: ["userId", "name", "email", "wallet"]
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: transactions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};



// ✏️ Update Status (approve/reject)
// const handleReferralBonus = async (user, amount) => {
//     try {
//         let finalAmount = amount;

//         // 🔥 only first time
//         if (user.paymentStatus === "pending") {

//             if (user.referredBy) {

//                 const upline = await User.findOne({
//                     where: { userId: user.referredBy }
//                 });

//                 if (upline) {
//                     const bonus = (amount * 10) / 100;

//                     // 💰 upline ko bonus
//                     upline.wallet += bonus;
//                     await upline.save();

//                     console.log(`🎁 Bonus ${bonus} given to ${upline.userId}`);

//                     // 🔥 user se cut
//                     finalAmount = amount - bonus;
//                 }
//             }

//             // 🔥 mark success
//             user.paymentStatus = "success";
//         }

//         return finalAmount;

//     } catch (error) {
//         console.log("Referral Bonus Error:", error.message);
//         return amount;
//     }
// };

// const updateTransactionStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         const transaction = await Transaction.findOne({ where: { id } });

//         if (!transaction) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Transaction not found"
//             });
//         }

//         // 🔥 already approved check
//         if (transaction.status === "approved") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Already approved"
//             });
//         }

//         // 🔥 update status
//         await transaction.update({ status });

//         // =========================
//         // 🔥 DEPOSIT
//         // =========================
//         if (transaction.type === "deposit" && status === "approved") {

//             const user = await User.findOne({
//                 where: { userId: transaction.userId }
//             });

//             if (user) {

//                 // 🔥 referral bonus 
//                 const finalAmount = await handleReferralBonus(user, transaction.amount);

//                 // 💰 wallet me cut karke amount add
//                 user.wallet += finalAmount;

//                 // 📈 investment full amount
//                 user.investment += transaction.amount;

//                 await user.save();
//             }
//         }

//         // =========================
//         // 🔥 WITHDRAW
//         // =========================
//         if (transaction.type === "withdraw" && status === "approved") {

//             const user = await User.findOne({
//                 where: { userId: transaction.userId }
//             });

//             if (!user) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "User not found"
//                 });
//             }

//             // ❌ safety check
//             if (user.wallet < transaction.amount) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Insufficient balance"
//                 });
//             }

//             // 💰 deduct
//             user.wallet -= transaction.amount;
//             user.investment -= transaction.amount;
//             await user.save();
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Status updated successfully"
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };

// 🔥 Referral Bonus (only first deposit)
const handleReferralBonus = async (user, amount) => {
    try {
        if (user.paymentStatus === "pending" && user.referredBy) {

            const upline = await User.findOne({
                where: { userId: user.referredBy }
            });

            if (upline) {
                const bonus = (amount * 10) / 100;

                upline.wallet += bonus;
                upline.investment += bonus;
                await upline.save();

                console.log(`🎁 Referral Bonus ₹${bonus} given to User ${upline.name}`);
            }

            // 🔥 mark as completed
            user.paymentStatus = "success";
            await user.save();
        }

    } catch (error) {
        console.log("Referral Bonus Error:", error.message);
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, withdrawMethod } = req.body;

        console.log("withdrawMethod", withdrawMethod);
        console.log("id", id);
        console.log("status", status);

        const transaction = await Transaction.findOne({ where: { id } });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        if (transaction.status === "rejected") {
            return res.status(400).json({
                success: false,
                message: "Already rejected"
            });
        }

        if (transaction.status === "approved") {
            return res.status(400).json({
                success: false,
                message: "Already approved"
            });
        }

        const user = await User.findOne({
            where: { userId: transaction.userId }
        });

        const admin = await User.findOne({
            where: { email: ADMIN_EMAIL }
        });

        if (!user || !admin) {
            return res.status(404).json({
                success: false,
                message: "User/Admin not found"
            });
        }

        console.log("Admin", admin.email);
        console.log("Admin Wallet", admin.wallet);

        // =========================
        // 🔥 UPDATE DATA OBJECT
        // =========================
        const updateData = { status };

        // =========================
        // 🔥 WITHDRAW VALIDATION
        // =========================
        if (transaction.type === "withdraw" && status === "approved") {

            const validMethods = ["BEP 20/USDT", "TRC 20/USDT", "Polygon/USDT"];

            if (!validMethods.includes(withdrawMethod)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid withdraw method"
                });
            }

            if (user.wallet < 100) {
                return res.status(400).json({
                    success: false,
                    message: "Minimum wallet balance should be $100 to withdraw"
                });
            }

            if (user.wallet < transaction.amount) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient balance"
                });
            }

            // ✅ save withdraw method
            updateData.withdrawMethod = withdrawMethod;
        }

        // =========================
        // 🔥 UPDATE STATUS (after validation)
        // =========================
        await transaction.update(updateData);

        // =========================
        // 🔥 DEPOSIT
        // =========================
        if (transaction.type === "deposit" && status === "approved") {

            user.wallet += transaction.amount;
            user.investment += transaction.amount;

            admin.wallet += transaction.amount;

            await handleReferralBonus(user, transaction.amount);

            await user.save();
            await admin.save();
        }

        // =========================
        // 🔥 WITHDRAW
        // =========================
        if (transaction.type === "withdraw" && status === "approved") {

            const charge = (transaction.amount * 10) / 100;
            const payout = transaction.amount - charge;

            // 👤 user full deduct
            user.wallet -= transaction.amount;
            user.investment -= transaction.amount;

            // 🏦 admin payout deduct
            admin.wallet -= payout;

            await user.save();
            await admin.save();
        }

        return res.status(200).json({
            success: true,
            message: "Status updated successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { createTransaction, getMyTransactions, getAllTransactions, updateTransactionStatus };
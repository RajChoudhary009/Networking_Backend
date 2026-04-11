const { User, Rank, Transaction } = require("../models");
// const { IncomeHistory } = require("../models");
const sendMail = require("../mailer/mailer")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hemankishere@gmail.com";
// const ADMIN_EMAIL = "raaz02256@gmail.com";

// 🔥 Multer setup (unchanged)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }
});

// 🔥 Helper function to generate unique userId
const generateUniqueUserId = async () => {
    let unique = false;
    let newCode = "";
    while (!unique) {
        newCode = "IN" + Math.floor(10000 + Math.random() * 90000);
        const existingUser = await User.findOne({ where: { userCode: newCode } });
        if (!existingUser) unique = true; // Agar nahi mila, unique hai
    }
    return newCode;
};

// 🔥 Helper function for referral code
const generateCode = (prefix) => {
    return prefix + Math.floor(10000 + Math.random() * 90000);
};

// 👤 Create User Controller with internal multer handling
const createUser = async (req, res) => {
    upload.single('userScanner')(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: "File upload failed", error: err.message });
        }

        const Scanner = req.file;
        const userScanner = Scanner ? `uploads/${Scanner.filename}` : null;

        const deleteFile = (filePath) => {
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        };

        try {
            const { name, email, password, referralCode } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                deleteFile(userScanner);
                return res.status(400).json({ success: false, message: "User already exists!" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            let referredBy = null;
            if (referralCode) {
                const refUser = await User.findOne({ where: { referralCode } });
                console.log("refUser", refUser)
                if (!refUser) {
                    deleteFile(userScanner);
                    return res.status(400).json({ message: "Invalid referral code" });
                }
                referredBy = refUser.userId;
            }

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                userCode: await generateUniqueUserId(),
                referralCode: generateCode("REF"),
                referredBy,
                rankId: 1,
                userScanner,  // ✅ yaha save ho raha hai
            });

            res.status(200).json({
                success: true, message: "User created successfully",
                data: newUser
            });

            // 🔥 Send welcome email with User ID and Password
            const COMPANY_NAME = process.env.MY_GLOBAL_APP || "LP Cloud ";
            const COMPANY_URL = process.env.COMPANY_URL || "http://global.win";
            const COMPANY_LOGO = process.env.COMPANY_LOGO || "https://www.kasandbox.org/programming-images/avatars/leaf-blue.png";

            await sendMail({
                to: email,
                subject: `Welcome to ${COMPANY_NAME}`,
                html: `
                <div style="font-family: Arial, sans-serif; background:#f4f4f4; width:100%; box-sizing:border-box;">
                    <div width:100%; margin:0; background:#fff; padding:15px; border-radius:8px; text-align:center; box-sizing:border-box;">
                        
                        <!-- Logo -->
                        <img src="${COMPANY_LOGO}" width="120" style="display:block; margin:0 auto 20px auto;" />
                        </b>
                        <h1 style="color:#333; margin-bottom:5px; font-size:20px";>Hey ${newUser.name} 👋</h1>
                        <h2 style="color:#333; margin-top:0;">🎉 Congratulations!</h2>
            
                        <p style="font-size:16px; line-height:1.5; margin:15px 0;">
                            Welcome to <b>${COMPANY_NAME}</b>! We are delighted to have you join our community.
                        </p>
            
                        <p style="font-size:16px; line-height:1.5; margin:10px 0;">🙏 Thank you for registering with us. Your account is now set up, and you are ready to explore all the exciting services we have to offer.</p>
            
                        <p style="font-size:16px; line-height:1.5; margin:10px 0;">💻 To get started, simply log in with your login credentials provided below.</p>
            
                        <p style="margin:20px 0; font-size:16px; font-weight:bold; line-height:1.6;">
                            🤵‍ Login Id: ${newUser.userCode}<br>
                            🔑 Password: ${password}
                        </p>
            
                        <a href="${COMPANY_URL}" style="text-decoration:none; display:inline-block;">
                            <button style="margin-top:20px; padding:12px 25px; background:#333; color:#fff; border:none; border-radius:5px; cursor:pointer; font-size:16px;">
                                Explore Now
                            </button>
                        </a>
            
                        <p style="margin-top:30px; font-size:16px;">Regards,<br><b>${COMPANY_NAME}</b></p>
                        <hr style="margin:25px 0; border-color:#ddd;" />
            
                        <p style="font-size:12px; color:#777; margin:5px 0;">
                            If you're having trouble clicking the button, copy & paste the URL below:
                        </p>
                        <p style="font-size:12px; margin:5px 0;">${COMPANY_URL}</p>
            
                        <p style="font-size:12px; color:#aaa; margin-top:20px;">
                            © 2026 ${COMPANY_NAME}. All rights reserved.
                        </p>
            
                    </div>
                </div>
                `
            });

        } catch (error) {
            deleteFile(userScanner); // agar DB insert fail hua toh delete ho jaaye
            res.status(500).json({
                success: false, message: "Server error",
                error: error.message
            });
        }
    });
};

const updateUserDetails = async (req, res) => {
    console.log("updateUserDetails")
    upload.single('userScanner')(req, res, async function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "File upload failed",
                error: err.message
            });
        }

        try {
            const userId = req.user.userId; // 🔥 token se

            const user = await User.findOne({ where: { userId } });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // 🔥 new file
            let newScannerPath = user.userScanner;

            if (req.file) {
                // purana file delete
                if (user.userScanner && fs.existsSync(user.userScanner)) {
                    fs.unlinkSync(user.userScanner);
                }

                newScannerPath = `uploads/${req.file.filename}`;
            }

            // 🔥 update fields
            const { paymentAddress } = req.body;

            await user.update({
                userScanner: newScannerPath,
                paymentAddress: paymentAddress || user.paymentAddress
            });

            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: user
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    });
};

const login = async (req, res) => {
    console.log("🔥 LOGIN API HIT");

    try {
        const { userCode, password } = req.body;

        const existingUser = await User.findOne({ where: { userCode } });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Wrong Password!"
            });
        }

        const global_user_token = jwt.sign(
            { userId: existingUser.userId },
            process.env.JWT_SECRET,
            { expiresIn: "60d" }
        );

        // 🍪 cookie set
        res.cookie("global_user_token", global_user_token, {
            httpOnly: true,
            secure: false,          // dev me false
            sameSite: "none",       // 🔥 MUST CHANGE
            maxAge: 60 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            user: existingUser,
            success: true,
            message: "User login Successfully!",
            global_user_token   // ✅ correct
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const adminLogin = async (req, res) => {
    console.log("🔥 ADMIN LOGIN API HIT");

    try {
        const { userCode, password } = req.body;

        const existingUser = await User.findOne({ where: { userCode } });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Wrong Password!"
            });
        }

        // role status check 
        if (existingUser.role !== "admin") {
            return res.status(401).json({
                message: `Access denied: You are logged in as ${existingUser.role}, but only Admin can access this.`
            })
        }

        const global_user_token = jwt.sign(
            { userId: existingUser.userId },
            process.env.JWT_SECRET,
            { expiresIn: "60d" }
        );

        // 🍪 cookie set
        res.cookie("global_user_token", global_user_token, {
            httpOnly: true,
            secure: false,          // dev me false
            sameSite: "none",       // 🔥 MUST CHANGE
            maxAge: 60 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            user: existingUser,
            success: true,
            message: "User login Successfully!",
            global_user_token   // ✅ correct
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("global_user_token", {
            httpOnly: true,
            secure: false, // production me true
            // sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "User logout Successfully!"
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUsers = async (req, res) => {
    console.log("get users")
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Rank,
                    as: "rankDetails"
                },
                {
                    model: Transaction,
                    as: "transactions"
                },
                {
                    model: User,
                    as: "referrals" // 👇 jo users iske under aaye
                },
                {
                    model: User,
                    as: "referrer" // 👆 jisne refer kiya
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {

    try {
        const { userId } = req.params;
        console.log("ID:", userId); // debug

        const user = await User.findOne({
            where: { userId: userId },
            include: [
                {
                    model: Rank,
                    as: "rankDetails"
                },
                {
                    model: Transaction,
                    as: "transactions"
                },
                {
                    model: User,
                    as: "referrals"
                },
                {
                    model: User,
                    as: "referrer"
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getExitingUsers = async (req, res) => {
    try {

        const userId = req.user.userId; // 👈 token se aaya

        const user = await User.findOne({
            where: { userId: userId }
        });
        // console.log("admin", adminId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully!",
            user
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// tree 

// 🔥 Recursive function (dynamic depth)
const buildTree = async (userId) => {

    const user = await User.findOne({
        where: { userId: userId },
        attributes: ["userId", "name", "email", "userCode"]
    });

    if (!user) return null;

    // 👇 direct referrals
    const children = await User.findAll({
        where: { referredBy: userId },
        attributes: ["userId", "name", "email", "userCode"]
    });

    // 👇 recursion
    const referrals = await Promise.all(
        children.map(child => buildTree(child.userId))
    );

    return {
        ...user.toJSON(),
        referrals
    };
};

// 👤 API
const getUserTree = async (req, res) => {
    try {
        const { userId } = req.params;

        // 👇 string ko number me convert kar lo safe side ke liye
        const data = await buildTree(Number(userId));

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const generateNewPassword = async () => {
    let unique = false;
    let newPassword = "";
    while (!unique) {
        newPassword = "N" + Math.floor(10000 + Math.random() * 90000);
        const existingUser = await User.findOne({ where: { password: newPassword } });
        if (!existingUser) unique = true;
    }
    return newPassword;
};

const forgotPassword = async (req, res) => {
    try {
        const { userCode } = req.body;

        if (!userCode) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await User.findOne({ where: { userCode } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 🔹 Generate temporary password
        const newPassword = await generateNewPassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 🔹 Update hashed password in DB
        user.password = hashedPassword;
        await user.save();

        // 🔹 Send email
        await sendMail({
            to: user.email,
            subject: "Forgot Password - GLOBAL",
            html: `
            <div style="font-family: Arial, sans-serif; background: #f5f6fa; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                
                <!-- HEADER -->
                <div style="background: linear-gradient(90deg, #6366f1, #a855f7); padding: 20px; color: white; text-align: center;">
                  <h2 style="margin: 0; font-size: 28px;">GLOBAL</h2>
                </div>
        
                <!-- BODY -->
                <div style="padding: 30px; text-align: center;">
                  <h3 style="color: #333;">Hello ${user.name},</h3>
                  <p style="color: #555; font-size: 16px;">We received a request to reset your account password. Use the temporary password below to login:</p>
                  
                  <div style="margin: 20px 0;">
                    <span style="display: inline-block; background: #6366f1; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;">
                      ${newPassword}
                    </span>
                  </div>
        
                  <p style="color: #555; font-size: 14px;">User Code: <b>${user.userCode}</b></p>
        
                  <p style="margin-top: 30px; font-size: 14px; color: #888;">
                  Use this password to login and set a new one to keep your account.
                  </p>
        
                  <a href="http://localhost:3000/login" 
                     style="display: inline-block; margin-top: 20px; padding: 12px 25px; background: #a855f7; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Login Now
                  </a>
                </div>
        
                <!-- FOOTER -->
                <div style="background: #f1f3f6; padding: 15px; text-align: center; font-size: 12px; color: #aaa;">
                  &copy; ${new Date().getFullYear()} GLOBAL. All rights reserved.
                </div>
        
              </div>
            </div>
            `
        });

        return res.status(200).json({ success: true, message: "Temporary password sent successfully" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


const contactAdmin = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // 🔹 Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // 🔹 Send Mail to Admin
        await sendMail({
            to: ADMIN_EMAIL,
            subject: "📩 New Message from User - GLOBAL",
            html: `
            <div style="font-family: Arial, sans-serif; background: #f5f6fa; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden;">
                
                <!-- HEADER -->
                <div style="background: linear-gradient(90deg, #6366f1, #a855f7); padding: 15px; color: #fff; text-align: center;">
                  <h2 style="margin: 0;">New User Message</h2>
                </div>

                <!-- BODY -->
                <div style="padding: 20px;">
                  <p><b>Name:</b> ${name}</p>
                  <p><b>Email:</b> ${email}</p>
                  <p><b>Message:</b></p>
                  <div style="background:#f1f3f6; padding:10px; border-radius:5px;">
                    ${message}
                  </div>
                </div>

                <!-- FOOTER -->
                <div style="background:#f9f9f9; padding:10px; text-align:center; font-size:12px; color:#888;">
                  GLOBAL Platform Notification
                </div>

              </div>
            </div>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Message sent to admin successfully"
        });

    } catch (error) {
        console.error("Contact Admin Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


const updateUserByEmail = async (req, res) => {
    try {
        const { email, name, role, password, rankId } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ Update fields
        if (name !== undefined) {
            user.name = name;
        }
        
        if (role !== undefined) {
            user.role = role;
        }

        if (rankId !== undefined) {
            const parsedRankId = parseInt(rankId);
        
            if (isNaN(parsedRankId) || parsedRankId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "rankId must be a positive integer"
                });
            }
        
            user.rankId = parsedRankId;
        }

        // 🔐 Password hash karke save karo
        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        console.error("Update User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = { createUser, updateUserDetails, login, adminLogin, logout, getExitingUsers, getUsers, getUserById, getUserTree, forgotPassword, contactAdmin, updateUserByEmail };
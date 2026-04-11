const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Scanner = require('../models/Scanner'); 

// ✅ Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// ✅ Upload Fields
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
}).fields([
    { name: 'scannerImage', maxCount: 1 },
]);

// ✅ Controller Function
const addAdminScanner = async (req, res) => {
    console.log("scanner api call");

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: 'File upload error',
                error: err.message
            });
        }

        try {
            const { scannerPayAdd } = req.body;

            // ✅ file
            const s1 = req.files?.['scannerImage']?.[0];
            const scannerImage = s1 ? `uploads/${s1.filename}` : null;

            if (!scannerPayAdd) {
                return res.status(400).json({
                    message: "scannerPayAdd is required"
                });
            }

            // ✅ DB save
            const data = await Scanner.create({
                scannerImage,
                scannerPayAdd,
            });

            return res.status(200).json({
                message: "Scanner data saved successfully",
                data
            });

        } catch (error) {
            console.error("DB Error:", error);

            const deleteFile = (filePath) => {
                if (filePath && fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            };

            deleteFile(req.files?.scannerImage?.[0]?.path);

            return res.status(500).json({
                message: "DB save failed, files removed",
                error: error.message
            });
        }
    });
};

const allScanner = async (req, res) => {
    try {
        const data = await Scanner.findAll({
            order: [["id", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const updateScanner = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                message: "File upload error",
                error: err.message
            });
        }

        try {
            const { id } = req.params;
            const { scannerPayAdd } = req.body;

            const scanner = await Scanner.findByPk(id);

            if (!scanner) {
                return res.status(404).json({
                    message: "Scanner not found"
                });
            }

            const deleteFile = (filePath) => {
                if (filePath && fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            };

            let scannerImage = scanner.scannerImage; // 👈 default old image

            // 🔥 if new file 
            const newFile = req.files?.['scannerImage']?.[0];

            if (newFile) {
                // ❌ old image delete
                deleteFile(scanner.scannerImage);

                // ✅ new image set
                scannerImage = `uploads/${newFile.filename}`;
            }

            await scanner.update({
                scannerPayAdd: scannerPayAdd || scanner.scannerPayAdd,
                scannerImage // 👈 always value 
            });

            return res.status(200).json({
                success: true,
                message: "Scanner updated successfully",
                data: scanner
            });

        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    });
};

const deleteScanner = async (req, res) => {
    try {
        const { id } = req.params;

        const scanner = await Scanner.findByPk(id);

        if (!scanner) {
            return res.status(404).json({
                message: "Scanner not found"
            });
        }

        // 🔥 file delete
        if (scanner.scannerImage && fs.existsSync(scanner.scannerImage)) {
            fs.unlinkSync(scanner.scannerImage);
        }

        await scanner.destroy();

        return res.status(200).json({
            success: true,
            message: "Scanner deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { addAdminScanner, allScanner, updateScanner, deleteScanner };
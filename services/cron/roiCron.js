require('dotenv').config({ path: __dirname + '/../../.env' });
const cron = require("node-cron");
const User = require("../models/User");


const distributeLevelROI = async (userId, roiAmount) => {
    try {
        const levels = [10, 5, 4, 3, 2, 1];

        let currentUser = await User.findOne({
            where: { userId }
        });

        for (let i = 0; i < levels.length; i++) {

            if (!currentUser || !currentUser.referredBy) break;

            const upline = await User.findOne({
                where: { userId: currentUser.referredBy }
            });

            if (!upline) break;

            // 🔥 dynamic direct count check
            const directCount = await User.count({
                where: { referredBy: upline.userId }
            });

            // ❌ if not required direct  then skip
            if (directCount < (i + 1)) {
                console.log(`❌ Level ${i + 1} skipped for User ${upline.userId} (Direct: ${directCount})`);
                currentUser = upline;
                continue;
            }

            // 💰 level income
            const levelIncome = (roiAmount * levels[i]) / 100;

            if (levelIncome <= 0) {
                currentUser = upline;
                continue;
            }

            upline.wallet += levelIncome;
            await upline.save();

            console.log(`✅ Level ${i + 1} → User ${upline.name} id ${upline.userId} got ${levelIncome}`);

            currentUser = upline;
        }

    } catch (error) {
        console.log("Level ROI Error:", error.message);
    }
};

// cron.schedule("* * * * *", async () => {
cron.schedule("0 0 * * 1-5", async () => {
    console.log("🔥 ROI Cron Running (Mon-Fri)");
    console.log(`Running at: ${new Date().toLocaleString()}`);

    try {
        const users = await User.findAll({
            where: { role: "user" }
        });

        for (const user of users) {

            // 🔥 2X check
            if (user.wallet >= user.investment * 2) {
                console.log(`⛔ ROI Stopped for User ${user.userId}`);
                continue;
            }

            // 💰 ROI sabko milega
            const roi = (user.wallet * 0.4) / 100;

            if (roi <= 0) continue;

            user.wallet += roi;
            await user.save();

            // 🔥 sirf level income me condition lagegi
            await distributeLevelROI(user.userId, roi);
        }

        console.log("✅ ROI + Level Distributed");

    } catch (error) {
        console.log("❌ ROI Cron Error:", error.message);
    }
});

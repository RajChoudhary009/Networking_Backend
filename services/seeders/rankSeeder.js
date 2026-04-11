const { Rank } = require("../models");

const seedRanks = async () => {
  try {
    await Rank.bulkCreate([
      { name: "RANK_1", reward: null, rewardAmount: 0 },

      { name: "RANK_2", reward: "Gold", rewardAmount: 5000 },

      { name: "RANK_3", reward: "Diamond", rewardAmount: 10000 },

      { name: "RANK_4", reward: "Blue Diamond", rewardAmount: 20000 },

      { name: "RANK_5", reward: "Ambassador", rewardAmount: 40000 },

      { name: "RANK_6", reward: "Blue Ambassador", rewardAmount: 60000 },

      { name: "RANK_7", reward: "Topaz", rewardAmount: 80000 },

      { name: "RANK_8", reward: "Blue Topaz", rewardAmount: 100000 },

      { name: "RANK_9", reward: "Ambassador Elite", rewardAmount: 200000 }
    ]);

    console.log("✅ Rank data inserted successfully");
  } catch (error) {
    console.error("❌ Seeder error:", error);
  }
};

module.exports = seedRanks;
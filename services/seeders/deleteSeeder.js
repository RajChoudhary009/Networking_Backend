require('dotenv').config({ path: __dirname + '/../../.env' }); // delete cammand, node deleteSeeder.js
const { database } = require('../connection/database');
const { Rank } = require("../models");

const deleteRankData = async () => {
  try {
    await database.authenticate();
    console.log('DB connected successfully.');

    // 🔥 Rank table purge
    await Rank.destroy({ where: {}, truncate: true, force: true });
    console.log('✅ All Rank data deleted. User and Transaction untouched!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Rank delete failed:', err);
    process.exit(1);
  }
};

deleteRankData();
require('dotenv').config({ path: __dirname + '/../../.env' }); // start cammand, node services/seeders/runSeeder.js
const seedRanks = require("./rankSeeder"); 
const { database } = require("../connection/database");

const runSeeder = async () => {
  try {
    await database.sync(); // tables create (force: true sirf dev me use karo)
    await seedRanks(); // ✅ Rank data insert
    console.log("🎉 Seeder run successfully!");
    process.exit(0); // process close
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
};

runSeeder();
const User = require("./User");
const Rank = require("./Rank");
const Transaction = require("./Transaction");

const db = {};

db.User = User;
db.Rank = Rank;
db.Transaction = Transaction;

// 🔥 Run Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
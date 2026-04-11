const { DataTypes } = require("sequelize");
const { database } = require("../connection/database");

const Rank = database.define("Rank", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: DataTypes.STRING, // RANK_1 to RANK_11
    allowNull: false
  },

  reward: {
    type: DataTypes.STRING,
    allowNull: true
  },

  rewardAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }

});


// ✅ Association
Rank.associate = (models) => {
  Rank.hasMany(models.User, { foreignKey: "rankId", as: "users" });
};

module.exports = Rank;
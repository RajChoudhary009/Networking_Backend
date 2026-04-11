const { DataTypes } = require("sequelize");
const { database } = require("../connection/database");

const IncomeHistory = database.define("IncomeHistory", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    level: {
        type: DataTypes.INTEGER
    },

    amount: {
        type: DataTypes.FLOAT
    }
});

module.exports = IncomeHistory;
const { DataTypes } = require("sequelize");
const { database } = require("../connection/database");

const Transaction = database.define("Transaction", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    // 👤 User jisne payment kiya
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users", // table name
            key: "userId"
        }
    },

    // 💰 Amount
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // 📸 Payment Screenshot (UPI proof)
    screenshot: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // 🏦 only for deposit
    paymentMethod: {
        type: DataTypes.ENUM("BEP 20/USDT", "TRC 20/USDT", "Polygon/USDT"),
        defaultValue: "BEP 20/USDT",
        allowNull: true
    },

    // 🔥 only for Withdraw 
    withdrawMethod: {
        type: DataTypes.ENUM("BEP 20/USDT", "TRC 20/USDT", "Polygon/USDT"),
        defaultValue: "BEP 20/USDT",
        allowNull: true
    },

    type: {
        type: DataTypes.ENUM("deposit", "withdraw"),
        allowNull: false
    },

    // 📌 Transaction Status
    status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending"
    },

});


// ✅ Association
Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
};

module.exports = Transaction;
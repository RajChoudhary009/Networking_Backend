const { DataTypes } = require("sequelize");
const { database } = require("../connection/database");

const User = database.define("User", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    // 🔐 Password
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    userCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    referralCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    referredBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    wallet: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    investment: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    // ✅ Scanner Image
    userScanner: {
        type: DataTypes.STRING,
        allowNull: true
    },

    role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user"
    },

    // ✅ Referral Payment Status
    referralPaymentStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    // ✅ Payment Status
    paymentStatus: {
        type: DataTypes.ENUM("pending", "success"),
        defaultValue: "pending"
    },

    paymentAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // ✅ Rank
    rankId: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }

});


// ✅ Associations (Correct Way)
User.associate = (models) => {

    // 🔁 Referral Tree
    User.hasMany(models.User, { as: "referrals", foreignKey: "referredBy", onDelete: "CASCADE", hooks: true });
    User.belongsTo(models.User, { as: "referrer", foreignKey: "referredBy" });

    // 🏆 Rank Relation
    User.belongsTo(models.Rank, { foreignKey: "rankId", as: "rankDetails" });

    // 💰 Transactions
    User.hasMany(models.Transaction, { foreignKey: "userId", as: "transactions", onDelete: "CASCADE", hooks: true });

};

module.exports = User;
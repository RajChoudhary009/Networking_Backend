const { DataTypes } = require("sequelize");
const { database } = require("../connection/database");

const Scanner = database.define("Scanner", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },

    // ✅ SCANNER IMAGES
    scannerImage: {
        type: DataTypes.STRING
    },

    // ✅ PAYMENT ADDRESSES
    scannerPayAdd: {
        type: DataTypes.STRING
    },

});

module.exports = Scanner;
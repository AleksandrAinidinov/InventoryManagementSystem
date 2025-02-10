const { Sequelize, DataTypes } = require('sequelize');

//postgresql://neondb_owner:npg_eHV4Laqn5vWm@ep-nameless-darkness-a8e3k0n6-pooler.eastus2.azure.neon.tech/neondb?sslmode=require

const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_eHV4Laqn5vWm', {
    host: 'ep-nameless-darkness-a8e3k0n6-pooler.eastus2.azure.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    }
});

const Inventory = sequelize.define('Inventory', {
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'inventory',
    timestamps: false,
});


module.exports = { Inventory, sequelize }

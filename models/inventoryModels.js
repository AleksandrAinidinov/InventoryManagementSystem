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

// Inventory Model that stores all the items
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

// Sales Model that stores all the transactions
const Sales = sequelize.define('Sales', {
    ItemSold: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    QuantitySold: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    PricePerItem: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    TotalSaleAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    SaleDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'sales',
    timestamps: false,
});


// Ledger Model that stores all the transactions with debit, credit and balance 
const Ledger = sequelize.define('Ledger', {
    date: { 
        type: DataTypes.DATE, 
        allowNull: false, 
        defaultValue: DataTypes.NOW 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    debit: { type: DataTypes.FLOAT, 
        allowNull: true, 
        defaultValue: 0 
    },
    credit: { type: DataTypes.FLOAT, 
        allowNull: true, 
        defaultValue: 0 
    },
    balance: { 
        type: DataTypes.FLOAT, 
        allowNull: false, 
        defaultValue: 0 
    },
}, {
    tableName: 'ledger',
    timestamps: false,
});


module.exports = { Inventory, Sales, Ledger, sequelize }

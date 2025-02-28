const express = require('express');
const { Inventory, Sales, Ledger } = require('../models/inventoryModels');
const { json } = require('body-parser');

const router = express.Router();

// Read All Inventory
router.get('/', async (req, res) => {
    try {
        const items = await Inventory.findAll();
        res.render('index', { items })
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});

// Add New Item
router.get('/add', (req, res) => {
    res.render('add'); 
});

router.post('/add', async (req, res) => {
    try {
        // Adding Inventory Item
        const Name = req.body.Name;
        const Quantity = req.body.Quantity;
        const Price = req.body.Price;
        const Description = req.body.Description;

        if (!Name || !Quantity || !Price || !Description) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        if (isNaN(Quantity) || Quantity < 0) {
            return res.status(400).json({ error: 'Quantity should be a valid number and can not be less than 0!'});
        }

        if (isNaN(Price) || Price  <= 0) {
            return res.status(400).json({ error: 'Price should be a valid number, more than 0!'});
        }
        
        const duplicateItem = await Inventory.findOne({ where: { Name } });
        if (duplicateItem) {
            return res.status(400).json({ error: `${Name} Item already exists!`});
        }

        await Inventory.create({ Name, Quantity, Price, Description});


        // Adding Ledger Transaction (debit)
        let debitFloat = Quantity * Price;

        const debitsSum = await Ledger.sum('debit');
        const creditsSum = await Ledger.sum('credit');

        const newBalance = debitsSum - creditsSum + debitFloat;

        await Ledger.create({ date: new Date(), name: Name, debit: debitFloat, credit: 0, balance: newBalance });

        res.redirect('/');
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});

// Edit Item
router.get('/edit/:id', async (req, res) => {
    const itemToEdit = await Inventory.findByPk(req.params.id);
    if (!itemToEdit) {
        return res.status(404).send("Item wasn't found!");
    }

    res.render('edit', { itemToEdit }); 
});

router.post('/edit/:id', async (req, res) => {
    try {
        const itemToEdit = await Inventory.findByPk(req.params.id);
        if (!itemToEdit) {
            return res.status(404).send("Item wasn't found!");
        }

        const Name = req.body.Name;
        const Quantity = req.body.Quantity;
        const Price = req.body.Price;
        const Description = req.body.Description;

        itemToEdit.Name = Name ? Name : itemToEdit.Name;
        itemToEdit.Quantity = Quantity ? Quantity : itemToEdit.Quantity;
        itemToEdit.Price = Price ? Price : itemToEdit.Price;
        itemToEdit.Description = Description ? Description : itemToEdit.Description;

        await itemToEdit.save();
        res.redirect('/');
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});

// Delete Item
router.get('/delete/:id', async (req, res) => {
    const itemToDelete = await Inventory.findByPk(req.params.id);
    if (!itemToDelete) {
        return res.status(404).send("Item wasn't found!");
    }

    res.render('delete', { itemToDelete })
});

router.post('/delete/:id', async (req, res) => {
    try {
        const itemToDelete = await Inventory.findByPk(req.params.id);
        if (!itemToDelete) {
            return res.status(404).send("Item wasn't found!");
        }

        await itemToDelete.destroy();
        res.redirect('/');
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});



// Sell Item
router.get('/sell', async (req, res) => {
    try {
        const items = await Inventory.findAll();
        res.render('sell', { items })
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});


router.post('/sell', async (req, res) => {
    try {
        // Selling Inventory Item
        const itemToSell = await Inventory.findByPk(req.body.ItemId);
        if (!itemToSell) {
            return res.status(400).send("Item wasn't found!");
        }

        const quantitySold = req.body.Quantity;
        if (isNaN(quantitySold) || quantitySold <= 0) {
            return res.status(400).send("Quantity should be a number and more that '0'!");
        }

        if (itemToSell.Quantity < quantitySold) {
            return res.status(400).send("Available quantity is less than the sale quantity!");
        }

        const totalSaleAmount = quantitySold * itemToSell.Price;

        await Sales.create({ ItemSold: itemToSell.Name, QuantitySold: quantitySold, PricePerItem: itemToSell.Price, TotalSaleAmount: totalSaleAmount});

        itemToSell.Quantity -= quantitySold;   // Inventory Update
        await itemToSell.save();

        // Adding Ledger Transaction (credit)
        let creditFloat = totalSaleAmount;

        const debitsSum = await Ledger.sum('debit');
        const creditsSum = await Ledger.sum('credit');

        const newBalance = debitsSum - creditsSum - creditFloat;

        await Ledger.create({ date: new Date(), name: itemToSell.Name, debit: 0, credit: creditFloat, balance: newBalance });

        res.redirect('/');
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});



// Sales History
router.get('/sales', async (req, res) => {
    try {
        // Retrieving all sales
        const sales = await Sales.findAll({ order: [['SaleDate', 'ASC']] });

        // Total Revenue Calculation
        let totalRevenue = 0;
        sales.forEach(sale => {
            totalRevenue += sale.TotalSaleAmount;
        });
        
        res.render('sales', { sales, totalRevenue })
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});


// Ledger
router.get('/ledger', async (req, res) => {
    try {
        const transactions = await Ledger.findAll({ order: [['date', 'ASC']] });
        res.render('ledger', { transactions })
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});



// Sales Summary
router.get('/summary', async (req, res) => {
    try {
        // Retrieving all sales
        const sales = await Sales.findAll({ order: [['SaleDate', 'ASC']] });

        // Total Revenue Calculation
        let totalRevenue = 0;
        sales.forEach(sale => {
            totalRevenue += sale.TotalSaleAmount;
        });

        // Total Items Sold Calculation
        let salesCount = 0;
        sales.forEach(sale => {
            salesCount++;
        });

        // Retrieving only 3 latest sales
        const recentSales = await Sales.findAll({ order: [['SaleDate', 'DESC']], limit: 3 });

        res.render('salesSummary', { totalRevenue, salesCount, recentSales })
    }
    catch (err){
        res.status(500).json({ error: err.message })
    }
});

module.exports = router;
const express = require('express');
const { Inventory } = require('../models/inventoryModels')

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

module.exports = router;
const express = require('express');

const router = require('./routes/inventoryRoutes');

const { sequelize } = require('./models/inventoryModels');

const app = express();

const PORT = process.env.PORT || 3010;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', router);
app.set('view engine', 'ejs');

sequelize.authenticate().then(() => {
    console.log("Connected to DB!");
})
.catch((err) => {
    console.log('Unable to connect to the database!', err);
});

sequelize
.sync()
.then(() => {
    console.log("Database synchronized!");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
})
.catch((error) => {
    console.error('Error syncing database:', error);
});
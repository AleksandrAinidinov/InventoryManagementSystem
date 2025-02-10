const express = require('express');
const favicon = require('serve-favicon');
const router = require('./routes/inventoryRoutes');
const path = require('path');
const { sequelize } = require('./models/inventoryModels');

const app = express();
app.use(express.static('public'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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
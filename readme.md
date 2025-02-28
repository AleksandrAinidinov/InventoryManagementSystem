# Sales Tracking With Simple Accounting Principles Repository

## Developer

- **Name**: Aleksandr Ainidinov  
- **Student ID**: 8905450
- **Class**: PROG2390 - Small Business Solutions - Sec4
- **Date**: 2025-02-28
- **Assignment**: Assignment 2: Sales Tracking with Simple Accounting Principles
- **GitHub Repository**: [SalesTrackingWithSimpleAccountingPrinciplesRepository](https://github.com/AleksandrAinidinov/Sales-Tracking-and-Accounting-System)

---

An extension of a basic Node.js Inventory Management System application using Express.js. This version of the system logs any action performed on items from the inventory in a ledger. While also tracking all the operations and sales.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AleksandrAinidinov/Sales-Tracking-and-Accounting-System.git
   cd SalesTrackingWithSimpleAccountingPrinciplesRepository
   ```

2. **Install dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Start the server**:
   Launch the application locally:
   ```bash
   npm start
   ```

---

## Usage

After starting the server, you can access the following pages:

- **Home Page**: `http://localhost:3010`  
  The main landing page of the application.
- **Add Item**: `http://localhost:3010/add`  
  Page that allows adding a new inventory item.
- **Edit Item**: `http://localhost:3010/edit/id`  
  Page that allows to edit the existing item.
- **Delete Item**: `http://localhost:3010/delete/id`  
  Page that allows to delete the item.
- **Sell Item**: `http://localhost:3010/sell`  
  Page that allows selling any existing inventory item.
- **All Sales**: `http://localhost:3010/sales`  
  Page that allows to view all of the sales and total revenue.
- **Sales Summary**: `http://localhost:3010/sales`  
  Page that allows to view total revenue, total number of sales and 3 recent sales.
- **Ledger**: `http://localhost:3010/ledger`  
  Page that displays all the actions in a ledger form.

---

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it as permitted under this license.

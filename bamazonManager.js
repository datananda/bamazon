require("dotenv").config();
const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("cli-table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "bamazon",
});

const productTable = new Table({
    head: ["ID", "PRODUCT NAME", "PRICE", "STOCK"],
    colWidths: [5, 40, 10, 10],
});

function addProduct(product, price, quantity) {
    connection.query("INSERT INTO products (product_name,", [numUnits, id], (err) => {
        if (err) throw err;
        connection.end();
    });
}

function newQuantityPrompt(product, price) {
    inquirer.prompt([
        {
            type: "input",
            message: `What is the stock quantity of ${product}?`,
            name: "productStock",
        },
    ]).then((response) => {
        if (/^[1-9]\d*$/.test(response.productStock)) {
            console.log("valid number");
        } else {
            console.log("\nPlease enter a number greater than zero.");
            newQuantityPrompt(product);
        }
    });
}

function newPricePrompt(product) {
    inquirer.prompt([
        {
            type: "input",
            message: `What is the price of ${product}?`,
            name: "productPrice",
        },
    ]).then((response) => {
        const priceFloat = parseFloat(response.productPrice);
        if (!Number.isNaN(priceFloat) && priceFloat > 0) {
            newQuantityPrompt(product, priceFloat);
        } else {
            console.log("\nPlease enter a number greater than zero. Do not enter $ or any other extra symbols.");
            newPricePrompt(product);
        }
    });
}

function newProductPrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product you would like to add?",
            name: "productName",
        },
    ]).then((response) => {
        if (response.productName) {
            newPricePrompt(response.productName);
        } else {
            console.log("\nYou must enter a product name.");
            newProductPrompt();
        }
    });
}

function addInventory(id, numUnits) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [numUnits, id], (err) => {
        if (err) throw err;
        connection.end();
    });
}

function promptForNumUnits(id, product) {
    inquirer.prompt([
        {
            type: "input",
            message: `How many units of ${product} would you like to add to stock?`,
            name: "numUnitsChoice",
        },
    ]).then((response) => {
        if (/^[1-9]\d*$/.test(response.numUnitsChoice)) {
            const numUnits = parseInt(response.numUnitsChoice, 10);
            console.log(`\nYou added ${numUnits} ${numUnits === 1 ? "unit" : "units"} of ${product}.`);
            addInventory(id, numUnits);
        } else {
            console.log("\nPlease enter a number greater than zero.");
            promptForNumUnits(id, product);
        }
    });
}

function checkForProduct(id) {
    connection.query("SELECT product_name FROM products WHERE item_id = ?", [id], (err, res) => {
        if (err) throw err;
        if (res.length > 0) {
            promptForNumUnits(id, res[0].product_name);
        } else {
            console.log("\nThat is not a valid product ID. Please try again.");
            promptForID();
        }
    });
}

function promptForID() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product you would like to add stock to?",
            name: "productChoice",
        },
    ]).then((response) => {
        checkForProduct(response.productChoice);
    });
}

function viewLowInventory() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", (err, res) => {
        if (err) throw err;
        res.forEach((row) => {
            productTable.push([row.item_id, row.product_name, `$${row.price.toFixed(2)}`, row.stock_quantity]);
        });
        console.log(productTable.toString());
        connection.end();
    });
}

function viewProducts() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", (err, res) => {
        if (err) throw err;
        res.forEach((row) => {
            productTable.push([row.item_id, row.product_name, `$${row.price.toFixed(2)}`, row.stock_quantity]);
        });
        console.log(productTable.toString());
        connection.end();
    });
}

function promptForChoice() {
    inquirer.prompt([
        {
            type: "list",
            message: "What do you want to do?",
            name: "actionChoice",
            choices: [
                "View products for sale",
                "View low inventory",
                "Add to inventory",
                "Add new product",
            ],
        },
    ]).then((response) => {
        console.log(response);
        switch (response.actionChoice) {
        case "View products for sale":
            viewProducts();
            break;
        case "View low inventory":
            viewLowInventory();
            break;
        case "Add to inventory":
            promptForID();
            break;
        case "Add new product":
            newProductPrompt();
            break;
        default:
            console.log("Sorry. That is not an option. Try again.");
            promptForChoice();
        }
    });
}

promptForChoice();

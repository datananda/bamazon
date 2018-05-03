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
    head: ["ID", "PRODUCT NAME", "PRICE"],
    colWidths: [5, 40, 10],
});

function buyProduct(id, numUnits) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?", [numUnits, id], (err, res) => {
        console.log(res);
    });
}

function checkProductAvailability(id, numUnits) {
    connection.query("SELECT product_name, stock_quantity FROM products WHERE item_id = ?", [id], (err, res) => {
        if (err) throw err;
        console.log(res);
        const availableUnits = res[0].stock_quantity;
        if (availableUnits >= numUnits) {
            console.log("you bought it!");
            buyProduct(id, numUnits);
        } else {
            console.log(`Sorry. There are only ${availableUnits} units of ${res[0].product_name} available for sale.`);
            connection.end();
        }
    });
}

function promptForNumUnits(id, product) {
    inquirer.prompt([
        {
            type: "input",
            message: `How many units of ${product} would you like to buy?`,
            name: "numUnitsChoice",
        },
    ]).then((response) => {
        if (/^[1-9]\d*$/.test(response.numUnitsChoice)) {
            const numUnits = parseInt(response.numUnitsChoice, 10);
            checkProductAvailability(id, numUnits);
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
            message: "What is the ID of the product you would like to buy?",
            name: "productChoice",
        },
    ]).then((response) => {
        checkForProduct(response.productChoice);
    });
}

function getProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", (err, res) => {
        if (err) throw err;
        res.forEach((row) => {
            productTable.push([row.item_id, row.product_name, `$${row.price}`]);
        });
        console.log(productTable.toString());
        promptForID();
    });
}

getProducts();

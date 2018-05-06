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

function validateNumUnits(units) {
    if (/^[1-9]\d*$/.test(units)) {
        return true;
    }
    return "Please enter a number greater than zero.";
}

function validateID(id) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT product_name FROM products WHERE item_id = ?", [id], (err, res) => {
            if (err) throw err;
            if (res.length > 0) {
                resolve(true);
            } else {
                reject("Please enter a valid product id.");
            }
        });
    });
}

function validatePrice(price) {
    const priceFloat = parseFloat(price);
    if (!Number.isNaN(priceFloat) && priceFloat > 0) {
        return true;
    }
    return "Please enter a number greater than zero. Do not enter $ or any other extra symbols.";
}

function addProduct(product, dept, price, quantity) {
    const records = [
        [product, dept, price, quantity],
    ];
    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?", [records], (err) => {
        if (err) throw err;
        console.log(`\nYou added ${product} to the ${dept} department's inventory with a stock quantity of ${quantity} and a price of $${price}.`);
        connection.end();
    });
}

function newPrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product you would like to add?",
            name: "productName",
            validate: input => input !== "",
        },
        {
            type: "input",
            message: "What department does the new product belong to?",
            name: "deptName",
            validate: input => input !== "",
        },
        {
            type: "input",
            message: "What is the price per unit of the new product?",
            name: "price",
            validate: validatePrice,
        },
        {
            type: "input",
            message: "What is the stock quantity of the new product?",
            name: "stock",
            validate: validateNumUnits,
            filter: val => parseInt(val, 10),
        },
    ]).then((response) => {
        addProduct(response.productName, response.deptName, response.price, response.stock);
    });
}

function addInventory(id, numUnits) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [numUnits, id], (err) => {
        if (err) throw err;
        console.log(`\nYou added ${numUnits} ${numUnits === 1 ? "unit" : "units"} of product id ${id}.`);
        connection.end();
    });
}

function addPrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product you would like to add stock to?",
            name: "productID",
            validate: validateID,
        },
        {
            type: "input",
            message: "How many units are you adding to stock?",
            name: "addUnits",
            validate: validateNumUnits,
            filter: val => parseInt(val, 10),
        },
    ]).then((response) => {
        addInventory(response.productID, response.addUnits);
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
        switch (response.actionChoice) {
        case "View products for sale":
            viewProducts();
            break;
        case "View low inventory":
            viewLowInventory();
            break;
        case "Add to inventory":
            addPrompt();
            break;
        case "Add new product":
            newPrompt();
            break;
        default:
            console.log("Sorry. That is not an option. Try again.");
            promptForChoice();
        }
    });
}

promptForChoice();

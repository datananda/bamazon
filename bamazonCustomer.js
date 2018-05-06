const inquirer = require("inquirer");
const Table = require("cli-table");
const connection = require("./connection");
const validation = require("./validation");

const productTable = new Table({
    head: ["ID", "PRODUCT NAME", "PRICE"],
    colWidths: [5, 40, 10],
});

function buyProduct(id, numUnits) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + (price * ?) WHERE item_id = ?", [numUnits, numUnits, id], (err) => {
        if (err) throw err;
    });
    connection.end();
}

function checkProductAvailability(id, numUnits) {
    connection.query("SELECT product_name, price, stock_quantity FROM products WHERE item_id = ?", [id], (err, res) => {
        if (err) throw err;
        const availableUnits = res[0].stock_quantity;
        if (availableUnits >= numUnits) {
            const cost = numUnits * res[0].price;
            console.log(`\nYou bought ${numUnits} ${numUnits === 1 ? "unit" : "units"} of ${res[0].product_name} for a total of $${cost.toFixed(2)}.`);
            buyProduct(id, numUnits);
        } else {
            console.log(`\nSorry. There ${availableUnits === 1 ? "is" : "are"} only ${availableUnits} ${availableUnits === 1 ? "unit" : "units"} of ${res[0].product_name} available for sale.`);
            connection.end();
        }
    });
}

function orderPrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            name: "productID",
            validate: validation.validProductID,
        },
        {
            type: "input",
            message: "How many units would you like to buy?",
            name: "numUnits",
            validate: validation.integerGreaterThanZero,
        },
    ]).then((response) => {
        checkProductAvailability(response.productID, parseInt(response.numUnits, 10));
    });
}

function getProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", (err, res) => {
        if (err) throw err;
        res.forEach((row) => {
            productTable.push([row.item_id, row.product_name, `$${row.price.toFixed(2)}`]);
        });
        console.log(productTable.toString());
        orderPrompt();
    });
}

getProducts();

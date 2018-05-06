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

const departmentTable = new Table({
    head: ["ID", "DEPARTMENT NAME", "OVERHEAD COSTS", "PRODUCT SALES", "TOTAL PROFIT"],
    colWidths: [5, 40, 16, 15, 14],
});

function validateNumUnits(units) {
    if (/^[1-9]\d*$/.test(units)) {
        return true;
    }
    return "Please enter a number greater than zero.";
}

function validateDepartment(dept) {
    return new Promise((resolve, reject) => {
        if (dept !== "") {
            connection.query("SELECT department_name FROM departments WHERE department_name = ?", [dept], (err, res) => {
                if (err) throw err;
                if (res.length > 0) {
                    reject("That department already exists.");
                } else {
                    resolve(true);
                }
            });
        } else {
            reject("Please enter a department name.");
        }
    });
}

function addDepartment(dept, costs) {
    const records = [
        [dept, costs],
    ];
    connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES ?", [records], (err) => {
        if (err) throw err;
        console.log(`\nYou added the department ${dept} which has overhead costs of $${costs}.`);
        connection.end();
    });
}

function newPrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department you would like to add?",
            name: "department",
            validate: validateDepartment,
        },
        {
            type: "input",
            message: "What is the overhead cost of the new deparment?",
            name: "cost",
            validate: validateNumUnits,
            filter: val => parseInt(val, 10),
        },
    ]).then((response) => {
        addDepartment(response.department, response.cost);
    });
}

function viewSales() {
    connection.query("SELECT department_id, departments.department_name as name, over_head_costs, SUM(product_sales) as sales, SUM(product_sales) - over_head_costs as profit FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY department_id", (err, res) => {
        if (err) throw err;
        res.forEach((row) => {
            departmentTable.push([row.department_id, row.name, `$${row.over_head_costs}`, `$${row.sales}`, `$${row.profit}`]);
        });
        console.log(departmentTable.toString());
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
                "View product sales by department",
                "Create new department",
            ],
        },
    ]).then((response) => {
        switch (response.actionChoice) {
        case "View product sales by department":
            viewSales();
            break;
        case "Create new department":
            newPrompt();
            break;
        default:
            console.log("Sorry. That is not an option. Try again.");
            promptForChoice();
        }
    });
}

promptForChoice();

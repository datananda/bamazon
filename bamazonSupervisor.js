const inquirer = require("inquirer");
const Table = require("cli-table");
const connection = require("./connection");
const validation = require("./validation");

const departmentTable = new Table({
    head: ["ID", "DEPARTMENT NAME", "OVERHEAD COSTS", "PRODUCT SALES", "TOTAL PROFIT"],
    colWidths: [5, 40, 16, 15, 14],
});

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
            validate: validation.integerGreaterThanZero,
        },
    ]).then((response) => {
        addDepartment(response.department, parseInt(response.cost, 10));
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

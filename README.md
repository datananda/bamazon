# Bamazon

Bamazon is a CLI node-based Amazon-like storefront with three interfaces that include the following user options:
1. [Customer](videos/bamazonCustomer.mp4)
    1. Purchase a product
1. [Manager](videos/bamazonManager.mp4)
    1. View products
    1. View low inventory products
    1. Add to inventory
    1. Add new product
1. [Supervisor](videos/bamazonSupervisor.mp4)
    1. View product sales by department
    1. Create a new department

## Getting Started

* Install the required node packages:

```
npm install
```

* Set up the MySQL database and tables. The [bamazon.sql](bamazon.sql) file includes all the commands you will need to run.

* Configure your environment variables. You .env file should include:

```
MYSQL_PASSWORD=YOUR_PASSWORD_HERE
```

## Built With

### Main Technologies
* [node.js](https://nodejs.org/en/)
* [MySQL](https://www.mysql.com/)

### Node Packages
* [inquirer](https://www.npmjs.com/package/inquirer) - for command-line prompts
* [cli-table](https://www.npmjs.com/package/cli-table) - for printing command-line tables
* [mysql](https://www.npmjs.com/package/mysql) - for connecting to MySQL database
* [dotenv](https://www.npmjs.com/package/dotenv) - for loading environment variables

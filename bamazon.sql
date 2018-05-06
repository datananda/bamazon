DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(5,2),
    stock_quantity INTEGER,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Juniper Bonsai", "Garden & Outdoor", 32.97, 23);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("FishHotel Mini Aquarium", "Pet Supplies", 34.75, 800);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Marc Tetro Wallet", "Clothing, Shoes & Jewelry", 35.00, 19);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Compact Mini Globe", "Home & Kitchen", 11.99, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Stainless Steel Water Bottle", "Home & Kitchen", 42.00, 43);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Keepsake Deluxe Turntable", "Electronics", 169.95, 33);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Cast-Iron Dutch Oven", "Home & Kitchen", 309.95, 2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LED Kitty Night Light", "Baby", 13.99, 114);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Leather Round Back Chair", "Home & Kitchen", 147.40, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Portable Bluetooth Speakers", "Electronics", 16.89, 58);

DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
	department_id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(100),
    over_head_costs INTEGER,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Garden & Outdoor", 400);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Pet Supplies", 200);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Clothing, Shoes & Jewelry", 1000);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Home & Kitchen", 1200);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 1500);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Baby", 300);

ALTER TABLE products
ADD product_sales DECIMAL(10,2) DEFAULT 0;
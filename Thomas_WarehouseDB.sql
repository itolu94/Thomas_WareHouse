CREATE DATABASE Thomas_WarehouseDB;

USE Thomas_WarehouseDB;

CREATE TABLE products (
    id INT AUTO_INCREMENT NOT NULL,
    item_id INT(8) NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price INT(6) NOT NULL,
    stock INT(4) NOT NULL,
    PRIMARY KEY (id)
)

 
 CREATE TABLE departments (
	id INT AUTO_INCREMENT NOT NULL,
    department_id MEDIUMINT NOT NULL,
    department_name VARCHAR(20) NOT NULL,
    over_head_costs MEDIUMINT NOT NULL,
    total_sales MEDIUMINT NOT NULL, 
    PRIMARY KEY (id)
 )
 
 INSERT INTO departments(department_id, department_name, over_head_costs, total_sales) VALUES (59382, 'Produce', 493, 0)
 
 
 SELECT * FROM products
 SELECT * FROM departments
 
 
 
 ALTER TABLE products 
CHANGE prodcuts_sale product_sales MEDIUMINT NOT NULL

SELECT products.department_name, departments.department_id, SUM(products.product_sales)
FROM departments
INNER JOIN products ON products.department_name=departments.department_name
GROUP BY products.departments_name

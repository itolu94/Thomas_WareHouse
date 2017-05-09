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
  
 SELECT * FROM products
 SELECT * FROM departments


SELECT products.department_name, d.department_id, products.product_sales
FROM departments AS d
INNER JOIN products ON products.department_name=d.department_name
GROUP BY products.department_name;
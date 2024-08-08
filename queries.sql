ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345';
FLUSH PRIVILEGES;

DROP DATABASE IF EXISTS restaurant;
CREATE DATABASE restaurant;
USE restaurant;

CREATE TABLE rest_types (
           type_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
           type_name VARCHAR(255) NOT NULL,
           UNIQUE KEY unique_type_name (type_name)
) ENGINE = InnoDB;

CREATE TABLE rest_products (
           product_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
           product_description VARCHAR(255) NOT NULL,
           type_id BIGINT NOT NULL,
           product_price DECIMAL(10,2) NOT NULL,
           UNIQUE KEY unique_product_description (product_description),
           FOREIGN KEY (type_id) REFERENCES rest_types(type_id)
) ENGINE = InnoDB;

CREATE TABLE rest_tables (
           table_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
           table_state ENUM ("open","closed") NOT NULL
) ENGINE = InnoDB;

CREATE TABLE rest_tables_products (
           table_product_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
           table_id BIGINT NOT NULL,
           product_id BIGINT NOT NULL,
           FOREIGN KEY (table_id) REFERENCES rest_tables(table_id),
           FOREIGN KEY (product_id) REFERENCES rest_products(product_id)
) ENGINE = InnoDB;

INSERT INTO rest_types (type_name) VALUES ('Main Dish'), ('Dessert'), ('Appetizer'), ('Beverage');
INSERT INTO rest_products (product_description, type_id, product_price) VALUES
('Spaghetti', 1, 15.00),
('Fish and Chips', 1, 10.00),
('Tiramisu', 2, 2.50),
('Bread', 3, 0.80),
('Water', 4, 1.20);
INSERT INTO rest_tables (table_state) VALUES ('open'), ('closed'), ('closed'), ('closed'), ('closed');
INSERT INTO rest_tables_products (table_id, product_id) VALUES
(1, 1),
(1, 1),
(1, 2);

COMMIT;


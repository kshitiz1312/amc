-- Create the database
CREATE DATABASE amc_management;

-- Use the newly created database
USE amc_management;

CREATE TABLE users (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email_id VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL
);

-- Create the orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    warranty_start_date DATE NOT NULL,
    warranty_end_date DATE NOT NULL
);

-- Create the amc_details table
CREATE TABLE amc_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amc_number INT CHECK (amc_number BETWEEN 1 AND 10),
    amc_start_date DATE,
    amc_end_date DATE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- Insert sample data into orders table
INSERT INTO orders (product_name, purchase_date, warranty_start_date, warranty_end_date)
VALUES 
('Product A', '2022-01-01', '2022-01-01', '2023-01-01'),
('Product B', '2022-02-01', '2022-02-01', '2023-02-01'),
('Product C', '2022-03-01', '2022-03-01', '2023-03-01'),
('Product D', '2022-04-01', '2022-04-01', '2023-04-01'),
('Product E', '2022-05-01', '2022-05-01', '2023-05-01'),
('Product F', '2022-06-01', '2022-06-01', '2023-06-01'),
('Product G', '2022-07-01', '2022-07-01', '2023-07-01'),
('Product H', '2022-08-01', '2022-08-01', '2023-08-01'),
('Product I', '2022-09-01', '2022-09-01', '2023-09-01'),
('Product J', '2022-10-01', '2022-10-01', '2023-10-01');

-- Insert sample data into amc_details table
INSERT INTO amc_details (order_id, amc_number, amc_start_date, amc_end_date)
VALUES
(1, 1, '2023-01-02', '2024-01-01'),
(1, 2, NULL, NULL),
(2, 1, '2023-02-02', '2024-02-01'),
(3, 1, '2023-03-02', '2024-03-01'),
(4, 1, '2023-04-02', '2024-04-01'),
(5, 1, '2023-05-02', '2024-05-01'),
(6, 1, '2023-06-02', '2024-06-01'),
(7, 1, '2023-07-02', '2024-07-01'),
(8, 1, '2023-08-02', '2024-08-01'),
(9, 1, '2023-09-02', '2024-09-01'),
(10, 1, '2023-10-02', '2024-10-01'),
(10, 2, '2024-10-02', '2025-10-01');

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS dyreklinikk;

-- Use the database
USE dyreklinikk;

-- Create owners table
CREATE TABLE IF NOT EXISTS owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100)
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    birth_date DATE,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE SET NULL
);

-- Insert some test data (optional)
INSERT INTO owners (firstname, lastname, phone, email) VALUES
('Ola', 'Nordmann', '12345678', 'ola@example.com'),
('Kari', 'Hansen', '87654321', 'kari@example.com'),
('Per', 'Jensen', '11223344', 'per@example.com');

INSERT INTO animals (name, species, birth_date, owner_id) VALUES
('Fido', 'Hund', '2020-05-15', 1),
('Whiskers', 'Katt', '2019-07-22', 2),
('Hopper', 'Kanin', '2021-03-10', 3),
('Max', 'Hund', '2018-11-30', 1),
('Luna', 'Katt', '2020-01-15', NULL);
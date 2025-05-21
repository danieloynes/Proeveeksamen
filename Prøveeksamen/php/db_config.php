<?php
// Database configuration
$host = "localhost";       // Database host
$username = "root";        // Database username
$password = "";            // Database password
$database = "dyreklinikk"; // Database name

// Create database connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character set to UTF-8
$conn->set_charset("utf8");
?>
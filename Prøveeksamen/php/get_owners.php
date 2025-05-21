<?php
// Include database configuration
require_once 'db_config.php';

// Set header to return JSON
header('Content-Type: application/json');

// SQL to get all owners
$sql = "SELECT * FROM owners ORDER BY lastname, firstname";

$result = $conn->query($sql);

$owners = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $owners[] = array(
            'id' => $row['id'],
            'firstname' => $row['firstname'],
            'lastname' => $row['lastname'],
            'phone' => $row['phone'],
            'email' => $row['email']
        );
    }
}

// Return JSON response
echo json_encode($owners);

// Close connection
$conn->close();
?>
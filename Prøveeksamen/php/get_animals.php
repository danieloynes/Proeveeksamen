<?php
// Include database configuration
require_once 'db_config.php';

// Set header to return JSON
header('Content-Type: application/json');

// SQL to get all animals with owner information
$sql = "SELECT a.id, a.name, a.species, a.birth_date, a.owner_id, 
               o.firstname, o.lastname, o.phone, o.email
        FROM animals a
        LEFT JOIN owners o ON a.owner_id = o.id
        ORDER BY a.name";

$result = $conn->query($sql);

$animals = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $animals[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'species' => $row['species'],
            'birth_date' => $row['birth_date'],
            'owner_id' => $row['owner_id'],
            'owner_name' => ($row['firstname'] ? $row['firstname'] . ' ' . $row['lastname'] : 'Ingen eier'),
            'owner_phone' => $row['phone'],
            'owner_email' => $row['email']
        );
    }
}

// Return JSON response
echo json_encode($animals);

// Close connection
$conn->close();
?>
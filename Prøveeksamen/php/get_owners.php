<?php
require_once 'db_config.php';

// SQL-spørring for å hente eiere
$sql = "SELECT * FROM owners ORDER BY id";
$result = $conn->query($sql);
$owners = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Hent dyr for denne eieren
        $owner_id = $row['id'];
        $animalsSql = "SELECT id, name, species FROM animals WHERE owner_id = $owner_id";
        $animalsResult = $conn->query($animalsSql);
        
        $animals = array();
        if ($animalsResult->num_rows > 0) {
            while($animalRow = $animalsResult->fetch_assoc()) {
                $animals[] = $animalRow;
            }
        }
        
        $row['animals'] = $animals;
        $owners[] = $row;
    }
}

// Returner data som JSON
header('Content-Type: application/json');
echo json_encode($owners);

$conn->close();
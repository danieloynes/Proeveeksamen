<?php
// Include database configuration
require_once 'db_config.php';

// Set header to return JSON
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $name = $_POST['name'] ?? '';
    $species = $_POST['species'] ?? '';
    $birth_date = $_POST['birth_date'] ?? null;
    $owner_id = intval($_POST['owner_id'] ?? 0);
    
    // Validate input
    if (empty($name) || empty($species)) {
        echo json_encode(['success' => false, 'message' => 'Navn og dyreart er påkrevd']);
        exit;
    }
    
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO animals (name, species, birth_date, owner_id) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $name, $species, $birth_date, $owner_id);
    
    // Execute the statement
    if ($stmt->execute()) {
        $animal_id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'Dyr registrert!', 'animal_id' => $animal_id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Feil ved registrering: ' . $stmt->error]);
    }
    
    // Close statement
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Ugyldig forespørsel']);
}

// Close connection
$conn->close();
?>
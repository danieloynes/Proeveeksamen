<?php
// Include database configuration
require_once 'db_config.php';

// Set header to return JSON
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $animal_id = intval($_POST['animal_id'] ?? 0);
    $owner_id = intval($_POST['owner_id'] ?? 0);
    
    // Validate input
    if ($animal_id <= 0 || $owner_id <= 0) {
        echo json_encode(['success' => false, 'message' => 'Ugyldig dyr-ID eller eier-ID']);
        exit;
    }
    
    // Prepare and bind
    $stmt = $conn->prepare("UPDATE animals SET owner_id = ? WHERE id = ?");
    $stmt->bind_param("ii", $owner_id, $animal_id);
    
    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Dyr knyttet til eier!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Feil ved tilknytning: ' . $stmt->error]);
    }
    
    // Close statement
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Ugyldig forespørsel']);
}

// Close connection
$conn->close();
?>
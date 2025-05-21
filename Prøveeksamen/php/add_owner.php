<?php
// Include database configuration
require_once 'db_config.php';

// Set header to return JSON
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get POST data
    $firstname = $_POST['firstname'] ?? '';
    $lastname = $_POST['lastname'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $email = $_POST['email'] ?? '';
    
    // Validate input
    if (empty($firstname) || empty($lastname)) {
        echo json_encode(['success' => false, 'message' => 'Fornavn og etternavn er påkrevd']);
        exit;
    }
    
    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO owners (firstname, lastname, phone, email) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $firstname, $lastname, $phone, $email);
    
    // Execute the statement
    if ($stmt->execute()) {
        $owner_id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'Eier registrert!', 'owner_id' => $owner_id]);
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
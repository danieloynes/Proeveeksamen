<?php
require_once 'db_config.php';

// Sjekk om forespørselen er en POST-forespørsel
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Hent data fra POST-forespørselen
    $animal_id = $conn->real_escape_string($_POST['animal_id']);
    $owner_id = $conn->real_escape_string($_POST['owner_id']);
    
    // SQL for å oppdatere dyr med eier-ID
    $sql = "UPDATE animals SET owner_id = $owner_id WHERE id = $animal_id";
    
    if ($conn->query($sql) === TRUE) {
        $response = array(
            'status' => 'success',
            'message' => 'Dyr koblet til eier!'
        );
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'Feil ved tilkobling: ' . $conn->error
        );
    }
    
    // Returner respons som JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}

$conn->close();
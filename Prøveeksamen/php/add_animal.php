<?php
require_once 'db_config.php';

// Sjekk om forespørselen er en POST-forespørsel
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Hent data fra POST-forespørselen
    $name = $conn->real_escape_string($_POST['name']);
    $species = $conn->real_escape_string($_POST['species']);
    $birth_date = $conn->real_escape_string($_POST['birth_date']);
    
    // SQL for å sette inn nytt dyr
    $sql = "INSERT INTO animals (name, species, birth_date) VALUES ('$name', '$species', '$birth_date')";
    
    if ($conn->query($sql) === TRUE) {
        $response = array(
            'status' => 'success',
            'message' => 'Dyr registrert!',
            'id' => $conn->insert_id
        );
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'Feil ved registrering: ' . $conn->error
        );
    }
    
    // Returner respons som JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}

$conn->close();
<?php
require_once 'db_config.php';

// Sjekk om forespørselen er en POST-forespørsel
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Hent data fra POST-forespørselen
    $firstname = $conn->real_escape_string($_POST['firstname']);
    $lastname = $conn->real_escape_string($_POST['lastname']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $email = $conn->real_escape_string($_POST['email']);
    
    // SQL for å sette inn ny eier
    $sql = "INSERT INTO owners (firstname, lastname, phone, email) 
            VALUES ('$firstname', '$lastname', '$phone', '$email')";
    
    if ($conn->query($sql) === TRUE) {
        $response = array(
            'status' => 'success',
            'message' => 'Eier registrert!',
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
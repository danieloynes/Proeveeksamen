<?php
$host = "localhost";
$username = "brukernavn"; // Bytt med din MySQL-brukernavn
$password = "passord";    // Bytt med ditt MySQL-passord
$database = "dyreklinikk";

// Opprett tilkobling
$conn = new mysqli($host, $username, $password, $database);

// Sjekk tilkobling
if ($conn->connect_error) {
    die("Tilkobling mislyktes: " . $conn->connect_error);
}

// Sett karaktersett til UTF-8
$conn->set_charset("utf8");
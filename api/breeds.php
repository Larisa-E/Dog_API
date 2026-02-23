<?php
header("Content-Type: application/json");

$apiUrl = "https://dog.ceo/api/breeds/list/all";
$response = file_get_contents($apiUrl);

if ($response === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch breeds"]);
    exit;
}

echo $response;

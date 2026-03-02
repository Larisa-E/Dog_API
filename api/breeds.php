<?php
// Always return JSON so frontend can parse consistently.
header("Content-Type: application/json");

// Dog API endpoint for full breed list.
$apiUrl = "https://dog.ceo/api/breeds/list/all";
$response = file_get_contents($apiUrl);

// If remote API call fails, return a clear JSON error message.
if ($response === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch breeds"]);
    exit;
}

// Pass through successful Dog API response.
echo $response;

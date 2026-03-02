<?php
// always return JSON to match frontend expectations
header("Content-Type: application/json");

// dog API endpoint for full breed list
$apiUrl = "https://dog.ceo/api/breeds/list/all";

$context = stream_context_create([
    "http" => [
        "method" => "GET",
        "timeout" => 8,
    ],
]);

$response = @file_get_contents($apiUrl, false, $context);

if ($response === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch breeds"]);
    exit;
}

echo $response;

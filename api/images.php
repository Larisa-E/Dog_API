<?php
// always return JSON to match frontend expectations
header("Content-Type: application/json");

if (!isset($_GET["breed"]) || empty($_GET["breed"])) {
    echo json_encode(["status" => "error", "message" => "Missing breed"]);
    exit;
}

$breed = urlencode($_GET["breed"]);

// build endpoint with optional sub-breed support
if (isset($_GET["subBreed"]) && !empty($_GET["subBreed"])) {
    $subBreed = urlencode($_GET["subBreed"]);
    $apiUrl = "https://dog.ceo/api/breed/$breed/$subBreed/images";
} else {
    $apiUrl = "https://dog.ceo/api/breed/$breed/images";
}

$context = stream_context_create([
    "http" => [
        "method" => "GET",
        "timeout" => 8,
    ],
]);

$response = @file_get_contents($apiUrl, false, $context);

if ($response === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch images"]);
    exit;
}

echo $response;

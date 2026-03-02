<?php
// Always return JSON to match frontend expectations.
header("Content-Type: application/json");

// Require a breed parameter from query string.
if (!isset($_GET["breed"]) || empty($_GET["breed"])) {
    echo json_encode(["status" => "error", "message" => "Missing breed"]);
    exit;
}

// Encode user input safely before putting into URL.
$breed = urlencode($_GET["breed"]);

// Build endpoint with optional sub-breed support.
if (isset($_GET["subBreed"]) && !empty($_GET["subBreed"])) {
    $subBreed = urlencode($_GET["subBreed"]);
    $apiUrl = "https://dog.ceo/api/breed/$breed/$subBreed/images";
} else {
    $apiUrl = "https://dog.ceo/api/breed/$breed/images";
}

$response = file_get_contents($apiUrl);

// Return error JSON if upstream call fails.
if ($response === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch images"]);
    exit;
}

// Pass through successful Dog API response.
echo $response;

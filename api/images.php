<?php
header("Content-Type: application/json");

if (!isset($_GET["breed"]) || empty($_GET["breed"])) {
    echo json_encode(["status" => "error", "message" => "Missing breed"]);
    exit;
}

$breed = urlencode($_GET["breed"]);

if (isset($_GET["subBreed"]) && !empty($_GET["subBreed"])) {
    $subBreed = urlencode($_GET["subBreed"]);
    $apiUrl = "https://dog.ceo/api/breed/$breed/$subBreed/images";
} else {
    $apiUrl = "https://dog.ceo/api/breed/$breed/images";
}

$response = file_get_contents($apiUrl);

if ($response === FALSE) {
    echo json_encode(["status" => "error", "message" => "Failed to fetch images"]);
    exit;
}

echo $response;

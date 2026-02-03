<?php
session_start();
$_SESSION = [];
session_destroy();

header("Access-Control-Allow-Origin:http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


echo json_encode(["status" => true, "message" => "ログアウトしました"]);
?>
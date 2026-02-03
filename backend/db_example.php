<?php
$host="localhost";
$dbname="pokemon_react_app";
$user="root";
$pass="";

try{
    $pdo=new PDO("mysql:host=$host;dbname=$dbname;charset=utf8;",$user,$pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
    http_response_code(500);
    echo json_encode(["error"=>"DB connect failed"]);
    exit;
}
?>
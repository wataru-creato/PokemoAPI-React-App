<?php
session_start();
require_once "db.php";
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin:http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}



$json=file_get_contents("php://input");
$data=json_decode($json,true);

$state=$data["state"] ?? "";
// $userId = $data["userId"] ?? null;
// $pokemonId = $data["pokemonId"] ?? null;


if(!isset( $_SESSION["user_id"])){
    echo json_encode([
        "status"=>false,
        "message"=>"ログインできていません。"
    ]);
    exit;
}

if ($state==="add" || $state ==="delete") {
if(!isset($data["pokemonId"])){
    echo json_encode([
        "status"=>false,
        "message"=>"ポケモンが選択されていません"
    ]);
    exit;
}
}

$userId=$_SESSION["user_id"];
$pokemonId=$data["pokemonId"] ?? null;


if($state==="add"){

try{
$sql_add="INSERT INTO favorites (user_id,pokemon_id) VALUES (:user_id,:pokemon_id)";
$stmt=$pdo->prepare($sql_add);
$stmt->execute([
        ":user_id"=>$userId,
        ":pokemon_id"=> $pokemonId
    ]);
    $favoriteId=$stmt->fetchColumn();
    echo json_encode([
            "status"=> true,
            "message"=> "お気に入りに追加しました",
        ]);
        exit;
}catch(PDOException $e){
    if($e->getCode()==="23000"){
        echo json_encode([
            "status"=>true,
            "message"=>"すでにお気に入りに登録されています"

        ]);
        exit;
    }
}

} elseif($state==="delete"){

$sql_del="DELETE FROM favorites WHERE user_id=:user_id AND pokemon_id=:pokemon_id";
$stmt=$pdo->prepare($sql_del);
    $stmt->execute([
        ":user_id"=>$userId,
        ":pokemon_id"=> $pokemonId
    ]);
    echo json_encode([
            "status"=> true,
            "message"=> "お気に入りから削除しました"
        ]);
        exit;

}elseif($state==="deleteAll"){

$sql_del_All="DELETE FROM favorites WHERE user_id = :user_id";
$stmt=$pdo->prepare($sql_del_All);
    $stmt->execute([
       ":user_id"=>$userId
    ]);
    echo json_encode([
         "status"=>true,
        "message"=>"お気に入りをすべて削除しました"
    ]);
    exit;

}elseif($state==="get"){

$sql_get="SELECT pokemon_id FROM favorites WHERE user_id=:user_id";
$stmt=$pdo->prepare($sql_get);
    $stmt->execute([
        ":user_id"=>$userId,
    ]);
     $favorites = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
            "status"=> true,
            "favorites" => $favorites
        ]);
        exit;

}else{
    echo json_encode([
        "status"=>false,
        "message"=>"不正なstate"
    ]);
}


?>
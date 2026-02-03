<?php
session_start();
require_once "db.php";
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}
$json=file_get_contents("php://input");
$data=json_decode($json,true);

$userId=$_SESSION["user_id"];
$pokemonId=$data["pokemonId"] ?? null;
$memoText=$data["memoText"] ?? '';


if(!isset( $_SESSION["user_id"])){
    echo json_encode([
        "status"=>false,
        "message"=>"ログインできていません。"
    ]);
    exit;
}

// if(!isset($data["pokemonId"])){
//     echo json_encode([
//         "status"=>false,
//         "message"=>"ポケモンが選択されていません"
//     ]);
//     exit;
// }

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql_getMemo="SELECT pokemon_id, memo_text FROM memos WHERE user_id=:user_id";
        $stmt = $pdo->prepare($sql_getMemo);
        $stmt->execute([
            ":user_id"=>$userId
            ]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $result = [];
        foreach ($rows as $row) {
            $result[$row['pokemon_id']] = $row['memo_text'];
        }

        echo json_encode($result);
        exit;

    } catch (PDOException $e) {
        echo json_encode(["status"=>false, "message"=>"DBエラー: ".$e->getMessage()]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
try{

$sql_memoEdit="INSERT INTO memos (user_id,pokemon_id,memo_text) VALUES (:user_id,:pokemon_id,:memo_text) ON DUPLICATE KEY UPDATE memo_text=:memo_text";
$stmt=$pdo->prepare($sql_memoEdit);
$stmt->execute([
    ":user_id"=>$userId,
    ":pokemon_id"=>$pokemonId,
    ":memo_text"=>$memoText
]);

 echo json_encode([
    "status"=>true,
     "message"=>"メモを保存しました"
     ]);
 exit;

}catch(PDOException $e){
    echo json_encode([
        "status"=>false,
        "message"=>"DBエラー".$e->getMessage()
    ]);
    exit;
}
}



?>
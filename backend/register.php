<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$json=file_get_contents("php://input");
$data=json_decode($json,true);

if(!empty($data["register"])){
    $user=trim($data["name"]);
    $pass=trim($data["pass"]);

    if(!empty($user) && !empty($pass)){
        $hash=password_hash($pass,PASSWORD_DEFAULT);

        try{
            $sql="INSERT INTO users (username,password_hash) VALUES(:username,:password_hash)";
            $stmt=$pdo->prepare($sql);
            $stmt->execute([
                ":username"=>$user,
                ":password_hash"=>$hash
            ]);
            echo json_encode([
                "status"=>true,
                "message"=>"新規登録に成功しました。"
            ]);
            exit;
        }catch(PDOException $e){
            if($e->getCode()==23000){
                echo json_encode([
                    "status"=>false,
                    "message"=>"そのユーザ名は使われています。"
                ]);
                exit;
            }
            echo json_encode([
                "status"=>false,
                "message"=>"データベースエラー"
            ]);
            exit;
        }
        }else{
            echo json_encode([
                "status"=>false,
                "message"=>"ユーザ名とパスワードは必須です。"
            ]);
            exit;  
        }
}else{
    echo json_encode([
        "status"=>false,
        "message"=>"リクエスト形式が不正です。"
    ]);
}


?>
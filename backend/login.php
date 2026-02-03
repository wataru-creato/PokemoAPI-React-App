<?php
session_start();
require_once "db.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

$error="";
$json=file_get_contents("php://input");
$data=json_decode($json,true);

if(!isset($data["name"],$data["pass"])){
    echo json_encode([
        "stat"=>"error",
        "message"=>"リクエスト形式が不正です。"
    ]);
    exit;
}

$user=trim($data["name"]);
$pass=trim($data["pass"]);

if(!empty($user) && !empty($pass)){
    try{
        $sql="SELECT * FROM users WHERE username=:username";
        $stmt=$pdo->prepare($sql);
        $stmt->execute([
            ":username"=>$user
        ]);
        $row=$stmt->fetch(PDO::FETCH_ASSOC);

        if($row && password_verify($pass,$row["password_hash"])){
            $_SESSION["login_user"]=$row["username"];
            $_SESSION["user_id"]=$row["id"];
            echo json_encode([
                "status"=>true,
                "id" => $row["id"],
                "username" => $row["username"],
                "message"=>"ログインに成功しました。"
            ]);        
        }else{
            echo json_encode([
                "status"=>false,
                "message"=>"ユーザ名またはパスワードが違います。"
            ]);    
        }
        exit;
    }catch(PDOException $e){
        error_log($e->getMessage());
        echo json_encode([
            "status"=>false,
            "message"=>"サーバエラーが発生しました。時間をおいて再度試してください。"
        ]);
    }
    exit;
}else{
    echo json_encode([
        "status"=>false,
        "message"=>"ユーザ名またはパスワードを入力してください。"

    ]);
}

?>
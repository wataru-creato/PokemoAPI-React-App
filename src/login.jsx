import {useState} from "react";

function Login({onLogin}){
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");

    const handleSubmit=()=>{
        onLogin({id:1,name:username});
    };

    return(
        <div>
            <h2>ログインページ</h2>
            <input type="text" name="user" id="user" onChange={(e)=>setUsername(e.target.value)} placeholder="ユーザ名"></input>
            <input type="password" name="pass" id="pass" onChange={(e)=>setPassword(e.target.value)} placeholder="ユーザ名"></input>
            <button type="submit" name="login" id="loginBtn" onClick={handleSubmit}>ログインする</button>
        </div>
    );
}
export default Login;
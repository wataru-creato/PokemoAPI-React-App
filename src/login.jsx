import {useState} from "react";
import Register from './Register.jsx'

function Login({onLogin}){
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [isRegister,setIsRegister]=useState(false);

    const handleSubmit=async()=>{
       const bodyData={name:username,pass:password};
       
       try{
            const res=await fetch("login.php",{
                method:"POST",
                headers:{
                "Content-Type":"application/json"
                },
                body:JSON.stringify(bodyData),
                });
                const data=await res.json();

                if(data.sucess){
                    onLogin({id:data.id,name:data.name});
                }else{
                    alert("ログイン失敗"+data.message);
                }
       }catch(e){
            console.log("通信エラー",e);
       }         
    };

    return(
        <div>
            {isRegister? (
            <Register onBack={()=>setIsRegister(false)}/>
        ):(
            <div>
            <h2>ログインページ</h2>
            <input type="text" name="user" id="user" onChange={(e)=>setUsername(e.target.value)} placeholder="ユーザ名"></input>
            <input type="password" name="pass" id="pass" onChange={(e)=>setPassword(e.target.value)} placeholder="パスワード"></input>
            <button type="submit" name="login" id="loginBtn" onClick={handleSubmit}>ログインする</button>
            <ul><a onClick={()=>setIsRegister(true)}>新規登録ページ</a></ul>
        </div>
                )}
                
        </div>   
    );
}
export default Login;
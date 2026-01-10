function Register({onBack}){
    const handleSubmit=()=>{
        console.log("登録成功しました！");
        setIsRegister(false);
    }
    return(
        <>
        <h2>新規ログインページ</h2>
            <input type="text" name="user" id="user" onChange={(e)=>setUsername(e.target.value)} placeholder="ユーザ名"></input>
            <input type="password" name="pass" id="pass" onChange={(e)=>setPassword(e.target.value)} placeholder="パスワード"></input>
            <button type="submit" name="login" id="loginBtn" onClick={handleSubmit}>登録する</button>
            <ul><a onClick={()=>onBack(false)}>ログイン画面に戻る</a></ul>
        </>
    );
}
export default Register;
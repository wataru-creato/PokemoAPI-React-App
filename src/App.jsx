import { useState } from 'react'
import './App.css'
import Login from'./login.jsx'
import Main from './main.jsx'


function App() {
  const [currentUser,setCurrentUser]=useState(null);

  const handleLogin=(user)=>{
    setCurrentUser(user);
  }
  
  const handleLogout=async()=>{
    const confirm=window.confirm("ほんとうにログアウトしますか？");
     if(!confirm)return;

    try{
      await fetch("http://localhost/pokemonAPI-React/logout.php",{
        method:"POST",
        credentials:"include",
        
      });
      setCurrentUser(null);
      alert("ログアウト成功！");
    }catch(error){
      console.log("ログアウト失敗",error);

    } 
  };
 
  return (
    <>
     {currentUser ? (
    <Main currentUser={currentUser} onLogout={handleLogout}/>):(<Login onLogin={handleLogin}/>
  )}

    </>
  );
}

export default App;

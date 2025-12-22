import { useState } from 'react'
import './App.css'
import Login from'./login.jsx'
import Main from './main.jsx'


function App() {
  const [currentUser,setCurrentUser]=useState(null);

  const[favoritePokemonIds,setFavoritePokemonIds]=useState([]);

  const[memos,setMemos]=useState({});

  const handleLogin=(user)=>{
    setCurrentUser(user);
    console.log({user});
  }
  
  const handleLogout=(user)=>{
    setCurrentUser(null);
    console.log({user});
  }
 
  return (
    <>
     {currentUser ? (
    <Main currentUser={currentUser} onLogout={handleLogout}/>):(<Login onLogin={handleLogin}/>
  )}

    </>
  );
}

export default App;

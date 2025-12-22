
function Main({currentUser,onLogout}){

  return(
    <div>
      <p>これはメインページです</p>
      <p>ようこそ、{currentUser.name}</p>
      <button type="submit" name="logout" onClick={onLogout}>ログアウト</button>
    </div>
  );

}


export default Main;
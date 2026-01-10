function FavoriteList({pokemon,onSelect,onRemove,onClose}){
    return(
        <div onClick={()=>onSelect(pokemon.id)}>
            <h2>{pokemon.name}</h2>
            <img src={pokemon.img}></img>
            <p>{pokemon.type}</p>
            <button onClick={(e)=>{
                e.stopPropagation();
                onRemove(pokemon.id);
                onClose;

            }}>お気に入りから削除する</button>             
        </div>
    );
}
export default FavoriteList;
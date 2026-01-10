function PokemonCard({pokemon,onSelect}){
    return(
        <div onClick={()=>onSelect(pokemon.id)}>
            <h2>{pokemon.name}</h2>
            <img src={pokemon.img}></img>
            <p>{pokemon.type}</p>         
        </div>
    );
}
export default PokemonCard;
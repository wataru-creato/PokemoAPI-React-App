function PokemonCard({pokemon,onSelect}){
    return(
        <div onClick={()=>onSelect(pokemon.id)} className="bg-gray-50 block border border-default rounded-lg shadow-xl text-center font-pixel rounded-lg shadow-xl opacity-95 w-full min-w-0 border-2 border-black rounded-lg">
            <h2 className="text-2xl">{pokemon.name}</h2>
            <img src={pokemon.img} className="mx-auto w-full max-w-[160px]"></img>
            <p className="text-xl">{pokemon.type}</p>         
        </div>
    );
}
export default PokemonCard;
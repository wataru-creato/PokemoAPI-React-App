function FavoriteList({pokemon,onSelect,onRemove,onClose}){
    return(
        <div onClick={()=>onSelect(pokemon.id)} className="bg-orange-100 block border border-default rounded-lg shadow-xl text-center font-pixel rounded-lg shadow-xl opacity-95 mb-4 border-2 border-black rounded-lg">
            <h2>{pokemon.name}</h2>
            <img className="w-24 h-24 object-contain mx-auto" src={pokemon.img}></img>
            <button className="group h-10 select-none rounded-lg bg-red-600 px-3 text-sm leading-8 text-zinc-50 shadow-[0_-1px_0_1px_#7f1d1d_inset,0_0_0_1px_#b91c1c_inset,0_0.5px_0_1.5px_#f87171_inset] hover:bg-red-700 active:bg-red-800 active:shadow-[-1px_0px_1px_0px_rgba(0,0,0,.2)_inset,1px_0px_1px_0px_rgba(0,0,0,.2)_inset,0px_0.125rem_0px_0px_rgba(0,0,0,.6)_inset]" onClick={(e)=>{
                e.stopPropagation();
                onRemove(pokemon.id);
                onClose;

            }}>さくじょする</button>             
        </div>
    );
}
export default FavoriteList;


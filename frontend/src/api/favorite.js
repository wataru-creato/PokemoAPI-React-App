export function addFavoriteAPI(userId, pokemonId) {
    console.log(userId);
    return fetchFavorite("add", userId, pokemonId);
}

export function removeFavoriteAPI(userId, pokemonId) {
    return fetchFavorite("delete", userId, pokemonId);
}

export function deleteFavoriteAllAPI(userId){
    return fetchFavorite("deleteAll",userId,null);
}

export function getFavoriteAPI(userId, pokemonId) {
    return fetchFavorite("get", userId, pokemonId);
}

async function fetchFavorite(state,userId,pokemonId) {
    try {
        const res = await fetch("http://localhost/pokemonAPI-React/backend/favorite.php", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                state:state,
                userId:userId,
                pokemonId:pokemonId
            }),
        });
        const data=await res.json();
        // const text = await res.text();
        // console.log(text);
        // const data = JSON.parse(text);
        
        if (!res.ok) {
            return {
                success: false,
                message: "HTTPS error" + data.message,
            };
        }
        if (!data.status) {
            return {
                success: false,
                message: "Not found favorite" + data.message,
            };
        }
       
        if(state==="add"){
                alert("お気に入り追加成功："+data.message);     
        }else if(state==="delete"){
                alert("お気に入り削除成功："+data.message); 
        }else if(state==="deleteAll"){ 
                alert("お気に入りのすべての削除成功："+data.message);         
        }

        return data

    } catch (error) {
        console.log("favorite fetch error", error);
        return {
            status: false,
            message: error.message,
        };
    }
}
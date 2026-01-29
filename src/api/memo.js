export function memoEditAPI(userId,pokemonId,memoText){
    return Memo(userId,pokemonId,memoText);
}


async function Memo(userId, pokemonId, memo){
    try{
        const res=await fetch("http://localhost/pokemonAPI-React/memo.php",{
            method: "POST",
            credentials: "include",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                userId:userId,
                pokemonId:pokemonId,
                memoText:memo
            }),
        });
        const data=await res.json();

        
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

        if(data.status===true){
            return{
                sucess:true,
                message:"メモ保存に成功しました。"+data.message,
            }
        }
    }catch(error){
        console.log("memoError",error);
    }
}
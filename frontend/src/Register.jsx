import {useState} from "react";
import bg from "../assets/pokemon_background_free.jpg";

function Register({onBack}){

    const [NewUsername,setNewUsername]=useState("");
    const [NewPassword,setNewPassword]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();
        // console.log("登録成功しました！");

        const newData={
            register:true,
            name:NewUsername,
            pass:NewPassword
        };

        try{
            const res=await fetch("http://localhost/PokemonAPI-React/backend/register.php",{
                    method:"POST",
                    credentials: "include",
                    headers:{
                        "Content-Type":"application/json"
                    },
                body:JSON.stringify(newData)
            });
            const data=await res.json();
            console.log(JSON.stringify(newData));

        if(data.status===true){
            alert("新規登録成功："+data.message)
        }else{
            alert("新規登録失敗："+data.message);
        }
    }catch(e){
        console.log("通信エラー",e);
    }
};


    return(
        <div className="font-pixel">
        <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: `url(${bg})` }}/>
        

             <div className="fixed inset-0 flex items-center justify-center">
            <div className="p-8 rounded-lg ">
            <div className="border-8 border-black rounder-lg flex-col justify-center px-20 py-20 bg-gray-50 text-2xl">
            <h2>しんきでにゅうりょくしてください</h2>
            <input type="text" name="user" id="user" onChange={(e)=>setNewUsername(e.target.value)} placeholder="ユーザ名" className="appearance-none block bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"/><br/>
            <input type="password" name="pass" id="pass" onChange={(e)=>setNewPassword(e.target.value)} placeholder="パスワード" className="appearance-none block bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"/>
            <br/><button type="submit" name="login" id="loginBtn" onClick={handleSubmit} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] hover:translate-x-[3px] hover:translate-y-[3px] hover:[box-shadow:0px_0px_rgb(82_82_82)]">▶　とうろくする</button>
            </div>
            </div>
            </div>
            
            <div className="absolute top-4 left-4">
            <div className="w-[620px] h-[160px] border-8 border-black border-t-transparent border-r-transparent px-4 py-2  bg-white">
                <h2 className="text-4xl">しんきとうろくがめん：L2</h2>
                <div className="flex item-center gap-3 py-8 justify-center">
                <p className="text-sm">HP:</p>
                <div className="relative w-[420px] h-[20px] border-2 border-black bg-black">
                    </div>
                    </div>   
            </div>
            </div>



            <div className="border-8 border-black rounder-lg fixed bottom-20 right-10  bg-gray-50 z-20">
            <button className="text-4xl px-10 py-20 flex flex-col gap-20 " onClick={()=>onBack(false)}>▶　ログインがめんにもどる</button>
            </div>


             <div className="fixed inset-x-0 bottom-8 flex justify-center z-10 overflow-hidden">
            <div className="container my-4 border-8 border-black rounded-lg bg-gray-50">
            <h2 className="text-4xl px-10 py-6">しんきとうろくする？</h2>
            </div>
            </div>
        </div>
    );
}
export default Register;
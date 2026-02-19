"use client"
import { useState } from "react";
import {supabase} from '@/lib/supabase'


export  default function login() {
    const [email ,setEmail] = useState("")
    const [password ,setPassword] = useState("")
    const [name, setName] = useState("")
    const [customId, setCustomId] = useState("")
    const [errorMessage ,setErrorMessage] = useState("")
    const [status ,setStatus] = useState("")

    
    

    const handleSignUp = async() => {

        const {data , error} = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, customId } }//これを書くことであとでuser_metadataとして取得できる。これはpublic.usersに保存される

        });
        if (error){
            setErrorMessage(error ? error.message : "") //error ? error.message : "" これはerrorが起こった場合error.messageを入れる　errorじゃなければ空文字
            console.log("signup error:",error);
        }else{
        setStatus("サインアップ成功")
        }
        console.log("session:",data.session)

    }
    const handleSignIn = async() =>{
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

        const user = data.user;
        const name = user?.user_metadata?.name;
        const customId = user?.user_metadata?.customId;
        
        if (error){
            setErrorMessage(error ? error.message : "")
            console.log("signup error:",error);
        }else{
            console.log("session:",data.session)
            setStatus("サインイン成功")
            const res = await fetch("/api/users",{
                method:"POST",
                headers:{"content-type":"application/json"},
                body: JSON.stringify({
                    id:data.user?.id,
                    email: data.user?.email,
                    customId:customId,
                    name:name,    
                })
            })
            console.log(await res.text());
        }
        
       

    }

    return (
      <div style={{padding:40}}>
          <h1>login</h1>
    
        <input 
            type="text"
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            style={{display:"block",marginBottom:10}}  />

        <input 
            type="text" 
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
            style={{display:"block",marginBottom:10}}
            />

        <input 
            type="text"
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
            style={{display:"block",marginBottom:10}}
            />

        <input 
            type="text"
            placeholder="customId"
            onChange={(e) => setCustomId(e.target.value)}
            style={{display:"block",marginBottom:10}}
            />

        <button onClick={handleSignIn} style={{marginRight:10}}>
            サインイン
        </button>
    
        <button onClick={handleSignUp}>
            サインアップ
        </button>
        
        <div>{errorMessage}</div>
        <div>{status}</div>


      </div>


    )
}
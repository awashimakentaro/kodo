"use client"
import { useState } from "react";
import {supabase} from '@/lib/supabase'


export  default function login() {
    const [email ,setEmail] = useState("")
    const [password ,setPassword] = useState("")
    const [errorMessage ,setErrorMessage] = useState("")
    const [status ,setStatus] = useState("")

    const handleSignUp = async() => {

        const Name = "Anonymous";
        const CustomId = `user_${crypto.randomUUID().slice(0, 8)}`;//userテーブルはname customId がnotnullのため適当なデータを挿入しとく一時的にね


        const {data , error} = await supabase.auth.signUp({
            email,
            password,
            options:{
                name: Name,
                customId: CustomId,
            }
        });
        if (error){
            setErrorMessage(error ? error.message : "") //error ? error.message : "" これはerrorが起こった場合error.messageを入れる　errorじゃなければ空文字
            console.log("signup error:",error);
        }
        setStatus("サインアップ成功")
        console.log("session:",data.session)

    }
    const handleSignIn = async() =>{
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
        if (error){
            setErrorMessage(error ? error.message : "")
            console.log("signup error:",error);
        }
        setStatus("サインイン成功")
        console.log("session:",data.session)
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
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
      <div className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-md px-5 pb-40 pt-6">
          <div className="w-full">
            <div className="mt-20 flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                Kodo
              </h1>
              <p className="mt-2 text-base font-medium text-slate-400">
                日々の歩みを、静かに分かち合う。
              </p>
            </div>

            <div className="mt-12 space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  ✉️
                </span>
                <input 
                    type="text"
                    placeholder='demo@kodo.jp'
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400"
                  />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  🔒
                </span>
                <input 
                    type="text" 
                    placeholder='password123'
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400"
                    />
              </div>

              <input 
                  type="text"
                  placeholder="name"
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400"
                  />

              <input 
                  type="text"
                  placeholder="customId"
                  onChange={(e) => setCustomId(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400"
                  />
            </div>

            <div className="mt-8 space-y-3">
              <button onClick={handleSignIn} className="h-14 w-full rounded-2xl bg-sky-500 text-sm font-semibold text-white shadow-sm">
                  ログインしてはじめる
              </button>
          
              <button onClick={handleSignUp} className="h-12 w-full rounded-2xl border border-slate-200 text-sm font-semibold text-slate-600">
                  サインアップ
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-rose-500">{errorMessage}</div>
            <div className="mt-1 text-center text-sm text-slate-500">{status}</div>
          </div>
        </div>
      </div>


    )
}

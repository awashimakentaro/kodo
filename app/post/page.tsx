"use client"
import  {useState} from 'react'
import { useAuth } from "@/app/providers/AuthProvider";


export function post() {
    const {user} = useAuth()
    const [memo ,setMemo] = useState("")
    const username = useAuth().user?.user_metadata?.name;
    

    const handlePost = async() =>{

        if (!user?.id) return;

        await fetch("api/post",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                userId: user.id,
                reflection: memo,
            })
        })

    }

    return (
          <div>
          <h1>Post</h1>
          <div>memoをdbに保存する。memoが保存されたらtask機能を追加する</div>
          <input 
            type="text"
            placeholder='memo'
            style={{marginBottom:10}}
            onChange={(e) => setMemo(e.target.value)}
          />
          <div>{memo}</div>
          <button onClick={handlePost}>
            保存
          </button>
          <div>username: {username ?? "ほんとにログインしてる？"}</div>
      </div>
    )
}

export default post
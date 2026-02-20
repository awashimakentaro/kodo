"use client"
import  {useState} from 'react'
import { useAuth } from "@/app/providers/AuthProvider";


export function post() {
    const {user} = useAuth()
    const [memo ,setMemo] = useState("")
    const [items, setItems] = useState([""])//配列
    const username = useAuth().user?.user_metadata?.name;

    const addInput = () =>{
        setItems((prev) => [...prev,""])//prevとはsetItems()から以前のitemsを導いてる。これにより配列が増えてくことができる
    }
    const removeInput = (index: number) =>{//index: numberとはindexには数値が入りますという意味
        setItems((prev) => prev.filter((_, i) => i !== index));//filterはこの場合 items[]においてi番目のindexを除いた配列を返す
    }
    

    const handlePost = async() =>{

        if (!user?.id) return;

        await fetch("api/post",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                userId: user.id,
                reflection: memo,
                tasks: items,
            })
        })

    }

    return (
        <div style={{ width: "100vw" }}>
          <div
            style={{
              display: "grid",//この要素の中身を高市場に並べる
              gridTemplateColumns: "50% 50%",//列を二つ作る
              width: "100%",
            }}
          >
            <div
              style={{
                padding: 16,
                borderRight: "1px solid #ddd",
                boxSizing: "border-box",//pading含めて100pxに収める
                display: "flex",
                flexDirection: "column",//縦方向に並べる
                gap: 8,
              }}
            >
              <h1>Post</h1>
              <div>memoをdbに保存する。memoが保存されたらtask機能を追加する</div>
              <input
                type="text"
                placeholder="memo"
                style={{ marginBottom: 10 }}
                onChange={(e) => setMemo(e.target.value)}
              />
              <div>{memo}</div>
              <button onClick={handlePost}>memoとtaskを保存</button>
              <div>username: {username ?? "ほんとにログインしてる？"}</div>
            </div>

            <div
              style={{
                padding: 16,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
                <h1>Tasks</h1>
                <div>taskを保存する、および前日のtaskを取得して表示する</div>
                {items.map((v,i)=> ( //mapとはこの場合items配列のある一つの要素を取り出し, value , index という　[りんご　0番目]　というような感じで取り出せる
                    <div key={i} style={{display:"flex",alignItems:"center", gap:8}}>

                        <input style={{flex:1}} value={v} onChange={(e)=>{

                            const next = [...items];//nextに配列をいれて
                            next[i] = e.target.value;//nextというitemsの配列のなかから[i]によりひとつを取得する
                            setItems(next)//これでinputBpxの中身を変更しても保存される

                        }} />
                        <button style={{ padding: "2px 6px" }} onClick={() => removeInput(i)}>-</button>
                    
                    </div>
                ))}
              <button onClick={addInput}>+</button>

            </div>
          </div>
        </div>
    )
}

export default post

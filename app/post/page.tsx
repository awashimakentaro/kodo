"use client"
import  {useState} from 'react'
import { useAuth } from "@/app/providers/AuthProvider";


export default function post() {
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
        <div className="min-h-screen bg-white">
          <div className="mx-auto w-full max-w-md px-5 pb-40 pt-6">
            <div className="px-5 pb-10 pt-6">
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-sm text-slate-800">
                  振り返りと目標
                </h1>
                <p className="text-sm font-medium tracking-sm text-slate-500">
                  今日の日記と明日のTaskかんがえるよ
                </p>
              </div>

              <div className="mb-6">
                <div className="px-1 text-xs font-bold uppercase tracking-sm text-slate-500">
                  今日の振り返り
                </div>
                <div className="mt-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <textarea
                    className="h-[88px] w-full resize-none bg-transparent text-base leading-6 text-slate-800 placeholder:text-slate-400 outline-none"
                    placeholder="どんな一日でしたか ?"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between px-1">
                  <div className="text-xs font-bold uppercase tracking-[1.2238px] text-slate-500">
                    明日の目標
                  </div>
                  <button
                    className="inline-flex h-7 w-7 items-center justify-center text-sky-500"
                    onClick={addInput}
                    aria-label="目標を追加"
                  >
                    +
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {items.map((v,i)=> ( //mapとはこの場合items配列のある一つの要素を取り出し, value , index という　[りんご　0番目]　というような感じで取り出せる
                      <div key={i} className="flex items-center gap-3">
                          <input
                            className="h-[56.5px] flex-1 rounded-[18px] border border-slate-100 bg-white px-5 text-sm tracking-[-0.2344px] text-slate-800 placeholder:text-slate-400 shadow-sm outline-none"
                            placeholder={`目標 ${i + 1}`}
                            value={v}
                            onChange={(e)=>{

                                const next = [...items];//nextに配列をいれて
                                next[i] = e.target.value;//nextというitemsの配列のなかから[i]によりひとつを取得する
                                setItems(next)//これでinputBpxの中身を変更しても保存される

                            }}
                          />
                          <button
                            className="h-[28px] w-[28px] rounded-full border border-slate-100 text-slate-400"
                            onClick={() => removeInput(i)}
                            aria-label="目標を削除"
                          >
                            -
                          </button>
                      </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="h-[65.5px] w-full rounded-[24px] bg-sky-500 text-lg font-medium tracking-[-0.4316px] text-white shadow-sm"
                  onClick={handlePost}
                >
                  記録を共有する
                </button>
                <div className="mt-2 text-center text-xs text-slate-400">
                  username: {username ?? "ほんとにログインしてる？"}
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

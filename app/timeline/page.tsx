"use client"
import { useState , useEffect} from 'react'
import { useAuth } from '../providers/AuthProvider';

type TimelinePost = {
    id: string;
    reflection: string;
    targetDate: string;
    user: { id: string; name: string; customId: string }
}

export default function timeline() {

    const [customId , setCustomId ] = useState("")
    const [foundUser, setFoundUser] = useState<any>(null);//any型とは方を問わないという意味理由はuserには文字や数字が含まれてるから
    const [notFound, setNotFound] = useState<string | null>(null)//<string | null> とは値に文字かnullが入るよ
    const [isFollowing, setIsFollowing] = useState(false)
    const [followMsg, setFollowMsg] = useState<string | null>(null);
    const [posts, setPosts] = useState<TimelinePost[]>([]);

    const {user} = useAuth()
    
    useEffect(() => {
        if (!user?.id) return;
  
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const ymd = d.toLocaleDateString("en-CA");
  
        fetch(`/api/timeline?userId=${user.id}&targetDate=${ymd}`)
          .then((res) => res.json())
          .then((data) => setPosts(data.posts ?? []));
      }, [user?.id]);



    const checkFollow = async (followingId: string) => {
        if (!user?.id || !followingId) return;
    
        const res = await fetch(
          `/api/follow?followerId=${user.id}&followingId=${followingId}`
        );
        const data = await res.json();
        setIsFollowing(!!data.isFollowing);
      };

    const toggleFollow = async () =>{

        if (!user?.id || !foundUser?.id) return

        if (isFollowing){
            await fetch ("/api/follow",{
                method:"DELETE",
                headers:{"Content-Type": "application/json" },
                body:JSON.stringify({ followerId: user.id , followingId: foundUser.id}),
            });

            setIsFollowing(false)
            setFollowMsg("フォロー解除しました");
        }else{
            await fetch("/api/follow",{
                method:"POST",
                headers:{"Content-Type": "application/json" },
                body: JSON.stringify({followerId: user.id, followingId: foundUser.id})
            })
            setIsFollowing(true);
            setFollowMsg("フォローしました")
        }

    }

    const serchId = async () =>{

        const res = await fetch(`/api/users?customId=${customId}`)
        const data = await res.json();

        if (!data.user){ 
            setNotFound("このユーザーはいないよ");
            setFoundUser(null)
            return
        }
        setFoundUser(data.user)//ここで検索したuserの情報を入れる
        setNotFound(null)
        await checkFollow(data.user.id)
    }

    const follow = async () =>{

    }

  return (
    <div>
        <div style={{
            display:"grid",
            gridTemplateColumns:"50% 50%"
            }}> 
            <div style={{
                display:"flex",
                flexDirection:"column",
                borderRight:"1px solid #300",
                padding:16,
                }}>

                <h1>follow</h1>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                    <input type="text"  style={{flex:1}} onChange={(e) => setCustomId(e.target.value)}/>
                    <button onClick={serchId}>検索</button>
                </div>
                {notFound && <div>{notFound}</div>}
                <div style={{display:"flex"}}>
                    {foundUser && (
                        <div>
                            <div style={{display:"flex", gap:12 ,alignItems:"center"}}>
                                名前:{foundUser.name} ID:{foundUser.customId}
                            </div>
                            <button style={{display:"flex"}} onClick={toggleFollow}>
                                {isFollowing ? "解除" : "フォロー"}
                            </button>
                        </div>)
                    }
                </div>
                
                

            </div>
            <div style={{
                display:"flex",
                flexDirection:"column",
                gap:8,
                padding:16,
                }}>

                <h1>timeline</h1>
                <div>機能のフォロワーの投稿</div>
                {
                    posts.length === 0 ? (<div>機能の橙子はありません</div>):
                    ( posts.map((p) => (
                        <div key={p.id}>
                            <div>{p.user.name}({p.user.customId})</div>
                            <div>{p.reflection}</div>
                        </div>
                    )))

                }

            </div>
        </div>
    </div>
  )
}


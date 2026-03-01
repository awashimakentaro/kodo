"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./providers/AuthProvider";
import { FaHeart, FaRegHeart } from "react-icons/fa";

type TimelinePost = {
  id: string;
  reflection: string;
  targetDate: string;
  user: { id: string; name: string; customId: string };
  likes?: { id: string }[];
};

export default function Home() {
  const [customId, setCustomId] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const [notFound, setNotFound] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followMsg, setFollowMsg] = useState<string | null>(null);
  const [posts, setPosts] = useState<TimelinePost[]>([]);

  const { user } = useAuth();

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

  const toggleFollow = async () => {
    if (!user?.id || !foundUser?.id) return;

    if (isFollowing) {
      await fetch("/api/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: user.id, followingId: foundUser.id }),
      });

      setIsFollowing(false);
      setFollowMsg("フォロー解除しました");
    } else {
      await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: user.id, followingId: foundUser.id }),
      });
      setIsFollowing(true);
      setFollowMsg("フォローしました");
    }
  };

  const serchId = async () => {
    const res = await fetch(`/api/users?customId=${customId}`);
    const data = await res.json();

    if (!data.user) {
      setNotFound("このユーザーはいないよ");
      setFoundUser(null);
      return;
    }
    setFoundUser(data.user);
    setNotFound(null);
    await checkFollow(data.user.id);
  };

  const toggleLike = async (postId: string, liked: boolean) => {
    const method = liked ? "DELETE" : "POST";
    await fetch("/api/like", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, postId }),
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: liked ? [] : [{ id: "temp" }] } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-md px-5 pb-40 pt-6">
        <header className="mb-6">
           <h1 className="font-bold text-gray-700 text-2xl  leading-10"> {/*<h1 className="text-[26px] font-bold tracking-[-0.43px] text-slate-800"></h1>  codexはこのように出力したがなるべく自分で頑張りたかったのでfgumaを参考に今のものに書き換えた、この調子で少しずつ慣れていく*/}
            タイムライン
          </h1>
          <p className="text-sm font-medium leading-5 text-slate-400 ">
            大切な仲間たちの歩み
          </p>
        </header>

        <div className="mb-4 flex items-center gap-3 rounded-[20px] border border-slate-100 bg-white px-5 py-4 shadow-sm">
            {/* rounded2xlとかでaiは実装してたけど20pxとかにも設定できる。しかし統一感を持たせるためにxlとかの形で指定していく方が美しくなるのかな？ borderを書かないとtailwindowは枠を消してしまう slateとはあおみがかったグレー色のことfigumaのままだと冗長すぎるー xとは横軸 yとは縦軸ね*/}
          <span >🔍</span>
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="友達をIDや名前で検索"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
          />
          <button
            className="rounded-2xl bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white"
            onClick={serchId}
          >
            検索
          </button>
        </div>

        {notFound && (
          <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600">
            {notFound}
          </div>
          
        )}

        {foundUser && (
          <div className="mb-6 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  {foundUser.name}
                </div>
                <div className="text-xs text-slate-400">
                  @{foundUser.customId}
                </div>
              </div>
              <button
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isFollowing
                    ? "bg-slate-100 text-slate-600"
                    : "bg-emerald-500 text-white"
                }`}
                onClick={toggleFollow}
              >
                {isFollowing ? "解除" : "フォロー"}
              </button>
            </div>
            {followMsg && (
              <div className="mt-2 text-xs text-slate-400">{followMsg}</div>
            )}
          </div>
        )}

        <section className="space-y-6">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              昨日のフォロー投稿はありません
            </div>
          ) : (
            posts.map((p) => {
              const liked = (p.likes?.length ?? 0) > 0;
              const dateLabel = new Date(p.targetDate).toLocaleDateString("ja-JP");

              return (
                <div
                  key={p.id}
                  className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {p.user.name}
                      </div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {dateLabel}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm font-normal leading-6 text-slate-600 whitespace-pre-wrap break-words">
                    {p.reflection}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      onClick={() => toggleLike(p.id, liked)}
                      className="inline-flex items-center gap-1"
                    >
                      {liked ? (<FaHeart className="h-5 w-5 text-red-500" />) : (<FaRegHeart className="h-5 w-5 text-slate-300" />)}
                      <span className="text-slate-500 text-sm font-semibold">いいね</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}

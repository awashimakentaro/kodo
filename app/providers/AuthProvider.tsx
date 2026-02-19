"use client"
//このAuthProviderはある程度お決まりの形があり0からコードをひらめいて書くのは無理

import {createContext, use, useContext, useEffect, useMemo, useState} from "react"
import type {Session, User } from "@supabase/supabase-js" //これはsession　userの情報を取得しているわけではなく型情報だけを取得している。
import {supabase} from "@/lib/supabase"


type AuthState = {
    session: Session | null;
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthState>({
    session: null,
    user: null,
    loading: true,
})

export function AuthProvider({children}:{children: React.ReactNode}){
    const [session,setSession] = useState<Session | null>(null) //<session | null>これはこのusestateの値はsession か　nullですよって意味
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        //このuseeffectは初回マウント(登場)時に一回発火する。サイト開いた後にログインしたら情報取れないじゃんて思った。理由はuseeffectは初回に発火したらそのあとは走らないんだからログイン後に何も起きないじゃんと思った
        //けどonAuthStateChangeにてサブスクしてるからログインしたタイミングでこいつが発火し問題ない
        //useEffect が一回走る その中で onAuthStateChange を 登録する 以降はログイン/ログアウトのたびに 登録済みリスナーのコールバックが発火する  一度登録すれば、その後のイベントは自動で届きます。
        //
        //

        let mounted = true; 
        //このmounted関数がなぜ存在するのかわからん。これはこのコンポーネントはまだ画面に存在しているか？を管理するフラグ
        //非同期処理は少し時間がかかる。もしgetsession()を呼びその間にページを移動するとコンポーネントが消える、でもpromiseが加瀬ってくる。これをsetStateしようとする　するとアンマウント済みのコンポーネントにsetStateという警告が出る
        //これはつまり非同期処理が終わる前にコンポーネントが消えたらsetStateしないための安全装置

        supabase.auth.getSession().then(({data})=>{
            if(!mounted) return;
            setSession(data.session ?? null);//??とはdata.sessionがあればdata.session なければnull
            setUser(data.session?.user ?? null);//sessionが存在するならuserを取る
            setLoading(false);
            //loadingのtrue,falseは、まず初めの段階ではログインしてるかわからないしuser不明だから「確認中」を示すのがloading これがないとログイン状態か否かを判定できない。
        });

        const {data: sub} = supabase.auth.onAuthStateChange((_event, session) => { // const {data: sub}　のようにするとonAuthStateChangeでsupabaseから取得したdataをsubという名前で扱える。こうすることでどうファイルに同じ関数名があった場合に分けることができる
            //onAuthStateChangeとはログイン状態が変わったら教えてとsupabaseにお願いしているもの。returnの中のsub.subscription.unsubscribe()は監視をやめていいよってお願いするもの。あんまわからん
            setSession(session);
            setUser(session?.user ?? null);
        })

        return () => {
            mounted = false;
            sub.subscription.unsubscribe()
        };
    },[]);
    const value = useMemo(() => ({session, user, loading}), [session, user, loading]) // [session, user, loading　が変わった時だけ再計算

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export function useAuth(){
    return useContext(AuthContext)
}
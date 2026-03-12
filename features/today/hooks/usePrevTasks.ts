import useSWR from "swr";
import { fetchPostTasks } from "../services/taskService";
import { TaskTextList } from "../types/type";

export const usePrevTasks = (userId?: string, targetDate?: string) => {
  const shouldFetch = Boolean(userId && targetDate);//ここでtrue or falseを判定する。これをkeyのところで使用することで,もしもtrueならkey cashを作りfetchするしfalseならそもそもfetchを起こさないと言う制御ができる
  const { data, error, isLoading } = useSWR<TaskTextList>(
    shouldFetch ? ["prevTasks", userId, targetDate] : null, //key
    () => fetchPostTasks(userId!, targetDate!), //fetcher
  );
  return {
    tasks: data ?? [],
    isLoading,
    isError: Boolean(error),
  };
};

//  ["prevPost", userId, targetDate] は SWR内部でシリアライズされて1つの文字列キーになります。その文字列キーを使って キャッシュ(Map)に保存されます。
//だから 同じ key なら同じキャッシュが返るし、key が変わると別データとして再取得されます。
// useSWR は概ねこんな形のオブジェクトを返します:

// {
//   data,          // 取得データ（キャッシュからも返る）
//   error,         // 失敗時のエラー
//   isValidating,  // 今まさに再取得中かどうか
//   isLoading,     // 初回ロード中かどうか（v2）
//   mutate,        // 手動でキャッシュ更新
// }

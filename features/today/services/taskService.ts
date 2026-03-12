import { TaskTextList, Task } from "../types/type";

export const fetchPostTasks = async (
  userId: string,
  targetDate: string,
): Promise<TaskTextList> => {
  const res = await fetch(`/api/post?userId=${userId}&targetDate=${targetDate}`);
  const data = (await res.json())
  return data?.post?.tasks?.map((t: Task) => t.text) ?? [];
  //data?.post?.tasks?とはdata / post / tasks が存在する時だけ進む .map((t) => t.text) tasks の各要素から text だけ抜き出す　(t) => t.text は アロー関数で、t は 引数（ここでは tasks の1要素）t.text を 返す という意味
};



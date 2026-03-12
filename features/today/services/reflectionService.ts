import { TaskTextList, Task } from "../types/type";
export const fetchMyPostReflection = async (
  userId: string,
  targetDate: string,
): Promise<string> => {
  const res = await fetch(`/api/my-post?userId=${userId}&targetDate=${targetDate}`);
  const data = await res.json();
  return data?.post?.reflection ?? "";
};

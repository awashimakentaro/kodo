import { TimelinePost } from "../types/types";

export const fetchTimelinePosts = async (
  userId: string,
  targetDate: string,
): Promise<TimelinePost[]> => { //Promiseとはあとで値が返ってくる箱である。そもそもとしてasync関数の戻り値はpromiseである。Promise<TimelinePost[]>ははこの形を指定している
  const res = await fetch(`/api/timeline?userId=${userId}&targetDate=${targetDate}`);
  const data = await res.json();
  return data.posts ?? [];
};

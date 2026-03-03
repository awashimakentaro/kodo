export const likePost = async (userId: string, postId: string) => {
  await fetch("api/like", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ userId, postId }),
  });
};
export const unlikePost = async (userId: string, postId: string) => {
  await fetch("/api/like", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, postId }),
  });
};

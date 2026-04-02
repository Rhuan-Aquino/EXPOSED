import { apiFetch } from "./api";

export type ApiPost = {
  id: string;
  content: string;
  imageUrl: string | null;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
};

export type ApiPostCreated = {
  id: string;
  content: string;
  imageUrl: string | null;
  userId: string;
  createdAt: string;
};

export type FeedPostItem = {
  id: string;
  /** Presente em posts vindos da API — usado para mostrar excluir só ao dono */
  userId?: string;
  author: { name: string; username: string; avatar: string };
  content: string;
  image?: string;
  createdAt: Date;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean;
};

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop";

export function mapApiPostToFeedItem(post: ApiPost): FeedPostItem {
  return {
    id: post.id,
    userId: post.userId,
    author: {
      name: post.user.name,
      username: post.user.username,
      avatar: post.user.avatarUrl?.trim() || DEFAULT_AVATAR,
    },
    content: post.content,
    image: post.imageUrl?.trim() || undefined,
    createdAt: new Date(post.createdAt),
    likes: 0,
    comments: 0,
  };
}

export function mapCreatedPostToFeedItem(
  post: ApiPostCreated,
  user: { name: string; username: string; avatarUrl?: string | null }
): FeedPostItem {
  return {
    id: post.id,
    userId: post.userId,
    author: {
      name: user.name,
      username: user.username,
      avatar: user.avatarUrl?.trim() || DEFAULT_AVATAR,
    },
    content: post.content,
    image: post.imageUrl?.trim() || undefined,
    createdAt: new Date(post.createdAt),
    likes: 0,
    comments: 0,
  };
}

export async function getPosts(): Promise<ApiPost[]> {
  return apiFetch("/posts");
}

export async function createPost(body: {
  content: string;
  image?: File | null;
}): Promise<ApiPostCreated> {
  const formData = new FormData();
  formData.append("content", body.content);
  if (body.image) {
    formData.append("image", body.image);
  }

  return apiFetch("/posts", {
    method: "POST",
    body: formData,
  });
}

export async function deletePost(postId: string): Promise<void> {
  await apiFetch(`/posts/${postId}`, { method: "DELETE" });
}

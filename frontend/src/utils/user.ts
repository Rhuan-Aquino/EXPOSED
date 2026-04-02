import { apiFetch } from "./api";

export type PublicUserProfile = {
  id: string;
  name: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  posts?: Array<{
    id: string;
    content: string;
    imageUrl?: string | null;
    userId: string;
    createdAt: string;
  }>;
};

export async function getUserByUsername(
  username: string
): Promise<PublicUserProfile> {
  return apiFetch(`/user/${username}`);
}

export async function updateMyProfile(data: {
  bio?: string;
  avatar?: File | null;
}): Promise<PublicUserProfile> {
  const formData = new FormData();
  formData.append("bio", data.bio ?? "");
  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  return apiFetch("/user/me", {
    method: "PUT",
    body: formData,
  });
}

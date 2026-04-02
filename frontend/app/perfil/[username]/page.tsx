"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { FileText } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { FeedPost } from "@/components/feed-post"
import { ProfileHeader } from "@/components/profile-header"
import { SmokeBackground } from "@/components/smoke-background"
import { ThemeToggle } from "@/components/theme-toggle"
import { getProfile } from "@/src/utils/auth"
import { getPosts, mapApiPostToFeedItem, type FeedPostItem } from "@/src/utils/posts"
import { getUserByUsername } from "@/src/utils/user"
import { mockPosts } from "@/src/utils/mock-data"

export default function PublicPerfilPage() {
  const params = useParams<{ username: string }>()
  const username = params?.username

  const [me, setMe] = useState<any>(null)
  const [profileUser, setProfileUser] = useState<any>(null)
  const [allPosts, setAllPosts] = useState<FeedPostItem[]>([])

  const posts = useMemo(() => {
    if (!profileUser?.id && !profileUser?.username) return []
    
    // Filtra as postagens da API pelo userId
    const apiP = profileUser?.id ? allPosts.filter((p) => p.userId === profileUser.id) : []
    
    // Adiciona as postagens mockadas caso o username bata
    const mockP = mockPosts.filter(p => p.author.username === profileUser.username)
    
    // Combina e ordena por data
    return [...apiP, ...mockP].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [allPosts, profileUser])

  useEffect(() => {
    getProfile().then(setMe).catch(() => {})
  }, [])

  useEffect(() => {
    if (!username) return
    getUserByUsername(username)
      .then(setProfileUser)
      .catch(() => {
        // Fallback to mock profile if backend fetch fails
        const mockPost = mockPosts.find(p => p.author.username === username)
        if (mockPost) {
          setProfileUser({
            id: `mock_${mockPost.author.username}`,
            name: mockPost.author.name,
            username: mockPost.author.username,
            avatarUrl: mockPost.author.avatar,
            bio: "Conteúdo satírico e fictício.",
          })
        }
      })
  }, [username])

  useEffect(() => {
    getPosts()
      .then((list) => setAllPosts(list.map(mapApiPostToFeedItem)))
      .catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen bg-background">
      <SmokeBackground />
      <div className="relative z-10">
        <AppSidebar>
          <div className="min-h-screen">
            <header className="sticky top-16 md:top-0 z-30 border-b border-border bg-background/95 backdrop-blur-lg">
              <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
                <h1 className="text-xl font-bold text-foreground tracking-tight">Perfil</h1>
                <ThemeToggle />
              </div>
            </header>

            <main className="bg-background">
              {profileUser && (
                <ProfileHeader
                  user={{
                    name: profileUser.name,
                    username: profileUser.username,
                    avatar:
                      profileUser.avatarUrl ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
                    bio: profileUser.bio || "",
                    postsCount: posts.length,
                  }}
                />
              )}

              <div className="mx-auto max-w-2xl">
                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Publicacoes
                  </h2>
                </div>

                {posts.length > 0 ? (
                  <div className="divide-y divide-border">
                    {posts.map((post) => (
                      <FeedPost
                        key={post.id}
                        {...post}
                        currentUserId={me?.id ?? null}
                        onPostDeleted={(id) =>
                          setAllPosts((prev) => prev.filter((p) => p.id !== id))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">
                      Nenhuma publicacao ainda
                    </h3>
                  </div>
                )}
              </div>
            </main>
          </div>
        </AppSidebar>
      </div>
    </div>
  )
}

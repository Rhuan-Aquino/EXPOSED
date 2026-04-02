"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ProfileHeader } from "@/components/profile-header"
import { FeedPost } from "@/components/feed-post"
import { ThemeToggle } from "@/components/theme-toggle"
import { SmokeBackground } from "@/components/smoke-background"
import { FileText } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { getProfile } from "@/src/utils/auth"
import { getPosts, mapApiPostToFeedItem, type FeedPostItem } from "@/src/utils/posts"
import { getUserByUsername, updateMyProfile } from "@/src/utils/user"

export default function PerfilPage() {
  const [me, setMe] = useState<any>(null)
  const [profileUser, setProfileUser] = useState<any>(null)
  const [allPosts, setAllPosts] = useState<FeedPostItem[]>([])

  const posts = useMemo(() => {
    if (!profileUser?.id) return []
    return allPosts.filter((p) => p.userId === profileUser.id)
  }, [allPosts, profileUser?.id])

  useEffect(() => {
    getProfile()
      .then(async (sessionUser) => {
        setMe(sessionUser)
        const fullUser = await getUserByUsername(sessionUser.username)
        setProfileUser(fullUser)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    getPosts()
      .then((list) => setAllPosts(list.map(mapApiPostToFeedItem)))
      .catch(() => {})
  }, [])

  const handleSaveProfile = async (data: { bio: string; avatar?: File | null }) => {
    const updated = await updateMyProfile(data)
    setProfileUser((prev: any) => ({ ...prev, ...updated }))
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Smoke background at z-0 */}
      <SmokeBackground />

      {/* Content at z-10 */}
      <div className="relative z-10">
        <AppSidebar>
          <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-lg">
              <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
                <h1 className="text-xl font-bold text-foreground tracking-tight">Perfil</h1>
                <ThemeToggle />
              </div>
            </header>

            {/* Main content */}
            <main className="bg-background">
              {/* Profile Header */}
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
                  editable
                  onSaveProfile={handleSaveProfile}
                />
              )}

              {/* Posts Section */}
              <div className="mx-auto max-w-2xl">
                {/* Section title */}
                <div className="flex items-center gap-3 border-b border-border px-4 py-4">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Publicações
                  </h2>
                </div>

                {/* Posts list */}
                {posts.length > 0 ? (
                  <div className="divide-y divide-border">
                    {posts.map((post, index) => (
                      <div
                        key={post.id}
                        className="animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                      >
                        <FeedPost
                          {...post}
                          currentUserId={me?.id ?? null}
                          onPostDeleted={(id) =>
                            setAllPosts((prev) => prev.filter((p) => p.id !== id))
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold text-foreground">
                      Nenhuma publicação ainda
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                      Quando você criar publicações, elas aparecerão aqui.
                    </p>
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

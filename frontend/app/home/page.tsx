"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { FeedPost } from "@/components/feed-post"
import { ThemeToggle } from "@/components/theme-toggle"
import { SmokeBackground } from "@/components/smoke-background"
import { CreatePost } from "@/components/create-post"
import { useEffect, useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { getProfile } from "@/src/utils/auth"
import { getUserByUsername } from "@/src/utils/user"
import {
  getPosts,
  mapApiPostToFeedItem,
  mapCreatedPostToFeedItem,
  type FeedPostItem,
  type ApiPostCreated,
} from "@/src/utils/posts"
import { mockPosts } from "@/src/utils/mock-data"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [feedPosts, setFeedPosts] = useState<FeedPostItem[]>([])
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    getProfile()
      .then(async (data) => {
        console.log("Dados do perfil:", data)
        try {
          const fullUser = await getUserByUsername(data.username)
          setUser({ ...data, ...fullUser })
        } catch {
          setUser(data)
        }
      })
      .catch(() => {
      })
  }, [])

  useEffect(() => {
    getPosts()
      .then((list) => setFeedPosts(list.map(mapApiPostToFeedItem)))
      .catch(() => {})
  }, [])

  const handlePostCreated = (created: ApiPostCreated) => {
    setFeedPosts((prev) => [
      mapCreatedPostToFeedItem(created, {
        name: user?.name || "Você",
        username: user?.username || "voce",
        avatarUrl: user?.avatarUrl,
      }),
      ...prev,
    ])
  }

  const handlePostDeleted = (id: string) => {
    setFeedPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Canvas fixed at z-0 — visible only in empty areas around content */}
      <SmokeBackground />

      {/* Sidebar + main content at z-10 with solid backgrounds */}
      <div className="relative z-10">
        <AppSidebar>
          <div className="min-h-screen">
            {/* Header with solid bg so smoke stays behind */}
            <header className="sticky top-16 md:top-0 z-30 border-b border-border bg-background/95 backdrop-blur-lg">
              <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
                <button
                  type="button"
                  onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                  className="flex items-center gap-2 text-base font-bold text-foreground transition-opacity hover:opacity-70"
                >
                  {sortOrder === "newest" ? "Recentes" : "Antigos"}
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </button>
                <ThemeToggle />
              </div>
            </header>

            {/* Feed — bg-background so smoke doesn't bleed through posts */}
            <main className="mx-auto max-w-2xl bg-background">
              {/* Create post box pinned just below the header */}
              <CreatePost
                currentUser={
                  user
                    ? {
                        name: user.name,
                        username: user.username,
                        avatarUrl: user.avatarUrl,
                      }
                    : null
                }
                onPostCreated={handlePostCreated}
              />
              <div className="divide-y divide-border">
                {[...feedPosts, ...mockPosts]
                  .sort((a, b) => {
                    if (sortOrder === "newest") {
                      return b.createdAt.getTime() - a.createdAt.getTime()
                    } else {
                      return a.createdAt.getTime() - b.createdAt.getTime()
                    }
                  })
                  .map((post) => (
                    <FeedPost
                      key={post.id}
                      {...post}
                      currentUserId={user?.id ?? null}
                      onPostDeleted={handlePostDeleted}
                    />
                  ))}
              </div>
            </main>
          </div>
        </AppSidebar>
      </div>
    </div>
  )
}
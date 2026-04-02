"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Flame, MoreHorizontal, Share2, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelativeTime } from "@/lib/format-date"
import { cn } from "@/lib/utils"
import { deletePost } from "@/src/utils/posts"

interface FeedPostProps {
  id: string
  userId?: string
  author: {
    name: string
    username: string
    avatar: string
  }
  content: string
  image?: string
  createdAt: Date
  likes: number
  comments: number
  isLiked?: boolean
  isSaved?: boolean
  currentUserId?: string | null
  onPostDeleted?: (id: string) => void
}

export function FeedPost({
  id,
  userId,
  author,
  content,
  image,
  createdAt,
  likes,
  isLiked: initialIsLiked = false,
  currentUserId,
  onPostDeleted,
}: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isOwner = Boolean(
    currentUserId && userId && currentUserId === userId
  )

  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [menuOpen])

  const handleLike = () => {
    if (!isLiked) {
      window.dispatchEvent(new CustomEvent("smoke-burst"))
    }
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deletePost(id)
      onPostDeleted?.(id)
      setConfirmOpen(false)
      setMenuOpen(false)
    } catch {
      // silencioso; pode evoluir para toast
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article className="border-b border-border bg-card transition-colors duration-200 hover:bg-card/80">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/perfil/${author.username}`}>
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-border transition-all duration-200 hover:ring-primary">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`/perfil/${author.username}`}
                className="truncate font-semibold text-foreground hover:underline"
              >
                {author.name}
              </Link>
              <Link
                href={`/perfil/${author.username}`}
                className="shrink-0 text-sm text-muted-foreground hover:underline"
              >
                @{author.username}
              </Link>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(createdAt)}
            </span>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              aria-label="Mais opções"
              aria-expanded={menuOpen}
              onClick={() => {
                if (!isOwner) return
                setMenuOpen((v) => !v)
              }}
              className={cn(
                "rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                !isOwner && "cursor-default opacity-40 hover:bg-transparent"
              )}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {menuOpen && isOwner && (
              <div className="absolute right-0 top-full z-20 mt-1 min-w-[10rem] overflow-hidden rounded-lg border border-border bg-card py-1 shadow-md">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                  onClick={() => {
                    setMenuOpen(false)
                    setConfirmOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  Excluir postagem
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <p
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap text-foreground transition-all duration-300",
              !expanded && "line-clamp-5 md:line-clamp-2"
            )}
          >
            {content}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs font-medium text-primary transition-opacity duration-200 hover:opacity-70"
          >
            {expanded ? "Ver menos" : "Ver mais"}
          </button>
        </div>

        {image && (
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <img
              src={image}
              alt="Post image"
              className="w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLike}
              className={cn(
                "group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-200",
                isLiked
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Flame
                className={cn(
                  "h-5 w-5 transition-all duration-200 group-hover:scale-110",
                  isLiked && "fill-current"
                )}
              />
              <span className="font-medium">{likeCount}</span>
            </button>

            <button
              type="button"
              className="group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
            >
              <Share2 className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-post-title"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-post-title"
              className="text-sm font-semibold text-foreground"
            >
              Excluir postagem?
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Isso não pode ser desfeito.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                className="rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
                onClick={() => setConfirmOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                className="rounded-full bg-destructive px-4 py-1.5 text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                onClick={handleConfirmDelete}
              >
                {deleting ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

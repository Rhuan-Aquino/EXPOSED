"use client"

import { useRef, useState } from "react"
import { ImagePlus, X, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  createPost as createPostApi,
  type ApiPostCreated,
} from "@/src/utils/posts"

const MAX_CHARS = 1000

const EXTRA_LOADING_MS = 5000

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

type CreatePostProps = {
  onPostCreated?: (post: ApiPostCreated) => void
  currentUser?: {
    name: string
    username: string
    avatarUrl?: string | null
  } | null
}

export function CreatePost({ onPostCreated, currentUser }: CreatePostProps) {
  const [text, setText] = useState("")
  const [preview, setPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const avatarSrc =
    currentUser?.avatarUrl?.trim() ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
  const avatarFallback =
    (currentUser?.name || "V").charAt(0).toUpperCase()

  const remaining = MAX_CHARS - text.length
  const isNearLimit = remaining <= 100
  const isOverLimit = remaining < 0

  const handleImage = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setImageFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImage(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleImage(file)
  }

  const removeImage = () => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setImageFile(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isOverLimit || isSubmitting) return

    const content = text.trim()
    setIsSubmitting(true)
    try {
      const created = await createPostApi({
        content,
        image: imageFile,
      })
      await delay(EXTRA_LOADING_MS)
      onPostCreated?.(created)
      setText("")
      removeImage()
    } catch {
      // opcional: toast; mantém simples
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-border bg-card p-4 transition-colors"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 shrink-0 ring-2 ring-border">
          <AvatarImage src={avatarSrc} alt={currentUser?.name || "Você"} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col gap-3">
          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS + 10))}
            placeholder="O que está acontecendo?"
            rows={3}
            className="w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground outline-none leading-relaxed text-sm"
          />

          {/* Image preview */}
          {preview && (
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img
                src={preview}
                alt="Preview"
                className="max-h-72 w-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute right-2 top-2 rounded-full bg-foreground/70 p-1 text-background backdrop-blur-sm transition-colors hover:bg-foreground"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Drop zone hint when dragging */}
          {isDragging && !preview && (
            <div className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-primary/50 text-sm text-muted-foreground">
              Solte a imagem aqui
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Actions row */}
          <div className="flex items-center justify-between">
            {/* Image button */}
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                id="post-image-upload"
              />
              <label
                htmlFor="post-image-upload"
                className="group flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <ImagePlus className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden sm:inline">Imagem</span>
              </label>
            </div>

            {/* Char counter + submit */}
            <div className="flex items-center gap-3">
              {/* Counter ring */}
              {text.length > 0 && (
                <div className="relative flex items-center justify-center">
                  <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16" cy="16" r="12"
                      fill="none"
                      strokeWidth="2.5"
                      className="stroke-border"
                    />
                    <circle
                      cx="16" cy="16" r="12"
                      fill="none"
                      strokeWidth="2.5"
                      strokeDasharray={`${2 * Math.PI * 12}`}
                      strokeDashoffset={`${2 * Math.PI * 12 * (1 - Math.min(text.length / MAX_CHARS, 1))}`}
                      strokeLinecap="round"
                      className={cn(
                        "transition-all duration-200",
                        isOverLimit
                          ? "stroke-destructive"
                          : isNearLimit
                          ? "stroke-yellow-500"
                          : "stroke-primary"
                      )}
                    />
                  </svg>
                  {isNearLimit && (
                    <span
                      className={cn(
                        "absolute text-[9px] font-bold",
                        isOverLimit ? "text-destructive" : "text-muted-foreground"
                      )}
                    >
                      {remaining}
                    </span>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!text.trim() || isOverLimit || isSubmitting}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Publicando…" : "Publicar"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

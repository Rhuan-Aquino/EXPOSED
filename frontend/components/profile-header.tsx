"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Edit3 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const BIO_MAX = 500

interface ProfileHeaderProps {
  user: {
    name: string
    username: string
    avatar: string
    bio?: string
    postsCount: number
  }
  editable?: boolean
  onSaveProfile?: (data: { bio: string; avatar?: File | null }) => Promise<void>
}

export function ProfileHeader({
  user,
  editable = false,
  onSaveProfile,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(user.bio || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const avatarSrc = preview || user.avatar

  useEffect(() => {
    setBio(user.bio || "")
  }, [user.bio])

  const revokePreview = () => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  const onPickAvatar = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return
    setAvatarFile(file)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const resetDraft = () => {
    setBio(user.bio || "")
    revokePreview()
    setAvatarFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const exitEdit = () => {
    setIsEditing(false)
    resetDraft()
  }

  const handleSave = async () => {
    if (!onSaveProfile) return
    setSaving(true)
    try {
      await onSaveProfile({ bio: bio.trim(), avatar: avatarFile })
      setIsEditing(false)
      revokePreview()
      setAvatarFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } finally {
      setSaving(false)
    }
  }

  const bioRemaining = BIO_MAX - bio.length

  return (
    <div className="relative overflow-hidden border-b border-border bg-card">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => onPickAvatar(e.target.files?.[0])}
      />

      <div className="relative px-4 py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            {/* Avatar — câmera estilo WhatsApp só no modo editar */}
            <div className="relative shrink-0">
              <Avatar
                className={cn(
                  "relative h-28 w-28 ring-4 ring-border md:h-36 md:w-36",
                  isEditing && "ring-primary/40"
                )}
              >
                <AvatarImage
                  src={avatarSrc}
                  alt={user.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-2xl font-bold text-muted-foreground md:text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {editable && isEditing && (
                <button
                  type="button"
                  aria-label="Alterar foto de perfil"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-card bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Camera className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {user.name}
                </h1>
                {editable && !isEditing && (
                  <button
                    type="button"
                    aria-label="Editar perfil"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                )}
                {editable && isEditing && (
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    Editando
                  </span>
                )}
              </div>

              <p className="mt-1 text-lg font-medium text-primary">
                @{user.username}
              </p>

              {/* Descrição — leitura */}
              {!isEditing && (
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground md:mx-0 mx-auto">
                  {user.bio?.trim()
                    ? user.bio
                    : editable
                      ? "Adicione uma descrição ao editar o perfil."
                      : "—"}
                </p>
              )}

              <div className="mt-6 flex justify-center md:justify-start">
                <div className="flex items-baseline gap-2 rounded-2xl bg-secondary/50 px-6 py-4 transition-colors hover:bg-primary/10">
                  <span className="text-4xl font-black tabular-nums tracking-tight text-foreground md:text-5xl">
                    {user.postsCount}
                  </span>
                  <span className="text-base font-medium text-muted-foreground">
                    {user.postsCount === 1 ? "post" : "posts"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Painel de edição: foto (FAB acima) + descrição */}
          {editable && isEditing && (
            <div className="mt-8 space-y-5 rounded-xl border border-border bg-muted/30 p-4 md:p-5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Foto de perfil
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Toque no ícone da câmera no canto da foto para escolher uma imagem.
                </p>
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="text-sm font-medium text-foreground"
                >
                  Descrição do perfil
                </label>
                <p className="mt-1 text-xs text-muted-foreground">
                  Aparece no seu perfil para outras pessoas. Só você pode editar aqui.
                </p>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value.slice(0, BIO_MAX))
                  }
                  rows={4}
                  className="mt-3 w-full resize-y rounded-lg border border-border bg-background p-3 text-sm leading-relaxed text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30"
                  placeholder="Escreva uma linha sobre você…"
                />
                <div className="mt-1.5 flex justify-end">
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      bioRemaining < 40
                        ? "text-amber-600 dark:text-amber-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {bio.length}/{BIO_MAX}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                  onClick={exitEdit}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={saving}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                  onClick={handleSave}
                >
                  {saving ? "Salvando…" : "Salvar alterações"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

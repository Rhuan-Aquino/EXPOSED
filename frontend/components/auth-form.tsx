"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, AtSign, ArrowRight } from "lucide-react"
import { FullPageLoader } from "@/components/full-page-loader"
import { cn } from "@/lib/utils"
import { login, register } from "@/src/utils/auth"

type Mode = "login" | "register"

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("login")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "login") {
        const result = await login({
          email: form.email,
          password: form.password,
        })
        console.log("Login result:", result)

        if (result?.token) {
          localStorage.setItem("token", result.token)
        }
      } else {
        const result = await register({
          name: form.name,
          username: form.nickname,
          email: form.email,
          password: form.password,
        })
        console.log("Register result:", result)
      }

      router.replace("/home")
    } catch (error) {
      console.error(`${mode === "login" ? "Login" : "Register"} error:`, error)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setForm({ name: "", nickname: "", email: "", password: "" })
    setAcceptTerms(false)
    setMode(next)
  }

  return (
    <>
      <FullPageLoader
        visible={loading}
        message={mode === "login" ? "Entrando..." : "Criando sua conta..."}
      />

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src="/logo-expoxed.png" alt="Exposed" className="h-28 w-auto object-contain drop-shadow-sm" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">EXPOXED</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Entre na sua conta para continuar"
                : "Crie sua conta gratuitamente"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-muted p-1">
          {(["login", "register"] as Mode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => switchMode(tab)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-300",
                mode === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name field — only on register */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required={mode === "register"}
                className="w-full rounded-xl border border-border bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Nickname field — only on register */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="Seu nickname (ex: @joao123)"
                required={mode === "register"}
                className="w-full rounded-xl border border-border bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              required
              className="w-full rounded-xl border border-border bg-input py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Sua senha"
              required
              className="w-full rounded-xl border border-border bg-input py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Forgot password */}
          {mode === "login" && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          {/* Terms checkbox — only on register */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              mode === "register" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required={mode === "register"}
                  className="peer sr-only"
                />
                <div className="h-5 w-5 rounded-md border-2 border-border bg-input transition-all duration-200 peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/20" />
                <svg
                  className="absolute h-3 w-3 text-primary-foreground opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                Tenho ciencia de que meus dados serao armazenados em um banco de dados e que esta plataforma foi desenvolvida exclusivamente para fins de estudo.
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>{mode === "login" ? "Entrar" : "Criar conta"}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </form>

        {/* Divider */}
        {/* <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">ou continue com</span>
          <div className="h-px flex-1 bg-border" />
        </div> */}

        {/* Social buttons */}
        {/* <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Google",
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              ),
            },
            {
              label: "GitHub",
              icon: (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              ),
            },
          ].map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:border-primary/30 active:scale-[0.98]"
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div> */}
      </div>
    </>
  )
}

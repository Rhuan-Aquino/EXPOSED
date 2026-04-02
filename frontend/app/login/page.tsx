import { AuthForm } from "@/components/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { SmokeBackground } from "@/components/smoke-background"

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Canvas fixed behind everything at z-0 */}
      <SmokeBackground />

      {/* Theme toggle — z-10 so it sits above the canvas */}
      <div className="fixed right-4 top-4 z-10">
        <ThemeToggle />
      </div>

      {/* Card sits at z-10 with solid bg so smoke stays behind it */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-xl shadow-foreground/5 transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10">
          <AuthForm />
        </div>
      </div>
    </main>
  )
}

"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  radius: number
  opacity: number
}

export function SmokeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -999, y: -999 })
  const particles = useRef<Particle[]>([])
  const animFrame = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("touchmove", onTouchMove, { passive: true })

    const spawnParticle = (x: number, y: number, big = false) => {
      const maxLife = 90 + Math.random() * 90
      particles.current.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.35 - Math.random() * 0.5,
        life: 0,
        maxLife,
        radius: big ? 35 + Math.random() * 55 : 20 + Math.random() * 35,
        opacity: 0,
      })
    }

    // Burst triggered by "fire" like
    const onSmokeBurst = () => {
      // Spawn a wave of particles from the bottom
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * canvas.width
        spawnParticle(x, canvas.height + 10, true)
      }
    }
    window.addEventListener("smoke-burst", onSmokeBurst)

    let frame = 0
    const isDark = () => document.documentElement.classList.contains("dark")

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Ambient smoke rising from bottom edge
      if (frame % 6 === 0) {
        spawnParticle(Math.random() * canvas.width * 0.25, canvas.height + 20, true)
        spawnParticle(canvas.width - Math.random() * canvas.width * 0.25, canvas.height + 20, true)
        spawnParticle(canvas.width * 0.4 + Math.random() * canvas.width * 0.2, canvas.height + 20, true)
      }

      // Mouse trail — only spawn outside of center card area on login
      if (mouse.current.x > 0 && frame % 2 === 0) {
        spawnParticle(mouse.current.x, mouse.current.y)
      }

      // Cap particles
      if (particles.current.length > 220) {
        particles.current.splice(0, particles.current.length - 220)
      }

      particles.current = particles.current.filter((p) => p.life < p.maxLife)

      const dark = isDark()

      for (const p of particles.current) {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vx += (Math.random() - 0.5) * 0.05
        p.vx *= 0.98
        p.radius += 0.2

        const progress = p.life / p.maxLife
        const maxOpacity = dark ? 0.22 : 0.13
        p.opacity =
          progress < 0.25
            ? (progress / 0.25) * maxOpacity
            : (1 - progress) * maxOpacity

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)

        if (dark) {
          grad.addColorStop(0, `rgba(100, 145, 255, ${p.opacity})`)
          grad.addColorStop(0.5, `rgba(70, 100, 230, ${p.opacity * 0.55})`)
          grad.addColorStop(1, `rgba(40, 60, 180, 0)`)
        } else {
          grad.addColorStop(0, `rgba(80, 120, 255, ${p.opacity})`)
          grad.addColorStop(0.5, `rgba(60, 90, 210, ${p.opacity * 0.5})`)
          grad.addColorStop(1, `rgba(40, 70, 180, 0)`)
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      animFrame.current = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animFrame.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("smoke-burst", onSmokeBurst)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  )
}

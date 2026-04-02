import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'EXPOXED',
  description: 'Conecte-se com pessoas ao redor do mundo.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/logo-expoxed.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo-expoxed.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo-expoxed.png',
      },
    ],
    apple: '/logo-expoxed.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

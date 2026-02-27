import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'AI Resume Optimizer СНГ — Оптимизируй резюме с помощью ИИ',
  description:
    'Загрузи резюме, вставь вакансию — получи ATS-оптимизированное резюме и сопроводительные письма за секунды. Бесплатно для первых 3 генераций.',
  keywords: 'резюме, оптимизация, ATS, Claude AI, СНГ, работа, вакансия',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

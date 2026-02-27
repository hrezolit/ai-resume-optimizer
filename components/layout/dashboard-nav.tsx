'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/actions/auth'
import {
  LayoutDashboard,
  Wand2,
  History,
  User,
  LogOut,
  FileText,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Profile } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/generate', label: 'Оптимизировать', icon: Wand2 },
  { href: '/history', label: 'История', icon: History },
  { href: '/profile', label: 'Профиль', icon: User },
]

export function DashboardNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen border-r border-border bg-card/30 p-4 gap-2">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-4 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg gradient-text">ResumeAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Plan badge */}
      <div className="mt-auto space-y-3">
        {profile.plan === 'free' ? (
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Free</Badge>
              <span className="text-xs text-muted-foreground">
                {profile.generations_used}/3 генераций
              </span>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_BOOSTY_URL || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="gradient" size="sm" className="w-full">
                <Zap className="w-3 h-3" />
                Купить Pro на Boosty
              </Button>
            </a>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-emerald-500/20">
            <Badge variant="pro" className="w-full justify-center py-1">
              ⚡ Pro активирован
            </Badge>
          </div>
        )}

        {/* Logout */}
        <form action={logout}>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" type="submit">
            <LogOut className="w-4 h-4" />
            Выйти
          </Button>
        </form>
      </div>
    </aside>
  )
}

export function MobileNav({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/80 backdrop-blur-md p-2 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            {item.label.split(' ')[0]}
          </Link>
        )
      })}
    </nav>
  )
}

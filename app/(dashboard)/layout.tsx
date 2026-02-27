import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav, MobileNav } from '@/components/layout/dashboard-nav'
import type { Profile } from '@/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get or create profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || null,
      plan: 'free',
      generations_used: 0,
      generations_reset_at: new Date().toISOString(),
    })
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex">
        <DashboardNav profile={profile as Profile} />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="pb-16 md:pb-0">{children}</div>
      </main>
      <MobileNav profile={profile as Profile} />
    </div>
  )
}

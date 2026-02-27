import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Wand2, History, Zap, Key, TrendingUp, FileText, Star } from 'lucide-react'
import { formatDate, getAtsColor } from '@/lib/utils'
import type { Profile, Generation } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: recentGenerations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const totalGenerations = recentGenerations?.length || 0
  const avgAts =
    totalGenerations > 0
      ? Math.round(
          (recentGenerations || []).reduce((a, g) => a + g.ats_score, 0) / totalGenerations
        )
      : 0

  const p = profile as Profile

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Привет, {p?.full_name?.split(' ')[0] || user.email?.split('@')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Готов оптимизировать резюме под следующую вакансию?
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Всего генераций</p>
                <p className="text-2xl font-bold">{totalGenerations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Средний ATS</p>
                <p className={`text-2xl font-bold ${getAtsColor(avgAts)}`}>
                  {avgAts > 0 ? `${avgAts}%` : '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Тариф</p>
                <p className="text-2xl font-bold capitalize">{p?.plan || 'Free'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* CTA */}
          <Card className="glass-card border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-emerald-500/5">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2">Оптимизировать резюме</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Загрузи PDF резюме, вставь текст вакансии — получи ATS-оптимизированное резюме
                и готовые сопроводительные письма.
              </p>
              <Link href="/generate">
                <Button variant="gradient" className="gap-2">
                  <Wand2 className="w-4 h-4" />
                  Начать оптимизацию
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent generations */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Последние генерации</CardTitle>
                <Link href="/history">
                  <Button variant="ghost" size="sm">Все</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentGenerations && recentGenerations.length > 0 ? (
                <div className="space-y-3">
                  {recentGenerations.map((gen: Generation) => (
                    <div
                      key={gen.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{gen.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(gen.created_at)}</p>
                      </div>
                      <Badge
                        className={`shrink-0 ml-2 ${
                          gen.ats_score >= 80
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : gen.ats_score >= 60
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        ATS {gen.ats_score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Генераций пока нет</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Plan & limits */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ваш тариф</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {p?.plan === 'free' ? (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Генерации в месяц</span>
                      <span className="font-medium">{p.generations_used}/3</span>
                    </div>
                    <Progress value={(p.generations_used / 3) * 100} className="h-2" />
                  </div>
                  <a
                    href={process.env.NEXT_PUBLIC_BOOSTY_URL || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="gradient" className="w-full" size="sm">
                      <Zap className="w-4 h-4" />
                      Купить Pro на Boosty
                    </Button>
                  </a>
                  <p className="text-xs text-muted-foreground text-center">
                    Pro — неограниченные генерации + приоритетные шаблоны
                  </p>
                </>
              ) : (
                <div className="text-center py-2">
                  <Badge variant="pro" className="mb-2">⚡ Pro</Badge>
                  <p className="text-sm text-muted-foreground">Неограниченные генерации</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Key status */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="w-4 h-4" />
                API ключ Claude
              </CardTitle>
            </CardHeader>
            <CardContent>
              {p?.anthropic_api_key ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-sm text-emerald-400">Подключён</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-sm text-yellow-400">Не настроен</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Добавь API ключ для автоматической оптимизации
                  </p>
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full">
                      Настроить
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

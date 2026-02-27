import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, FileText } from 'lucide-react'
import { formatDate, getAtsColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Generation } from '@/types'
import { HistoryDetailModal } from '@/components/resume/history-detail-modal'

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          История генераций
        </h1>
        <p className="text-muted-foreground mt-1">
          {generations?.length || 0} генераций в вашем аккаунте
        </p>
      </div>

      {generations && generations.length > 0 ? (
        <div className="space-y-3">
          {generations.map((gen: Generation) => (
            <Card key={gen.id} className="glass-card hover:border-primary/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{gen.title}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(gen.created_at)}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={cn(
                          'text-xs',
                          gen.ats_score >= 80
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : gen.ats_score >= 60
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        )}>
                          ATS {gen.ats_score}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {gen.cover_letters?.length || 0} писем
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <HistoryDetailModal generation={gen} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-medium text-muted-foreground">Пока нет генераций</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Начни оптимизировать резюме на странице &ldquo;Оптимизировать&rdquo;
          </p>
        </div>
      )}
    </div>
  )
}

'use client'

import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import { getAtsColor, getAtsBg } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface AtsScoreProps {
  score: number
  recommendations: string[]
}

export function AtsScore({ score, recommendations }: AtsScoreProps) {
  const label =
    score >= 80 ? 'Отлично' : score >= 60 ? 'Хорошо' : 'Требует улучшений'

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          ATS-совместимость
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score circle */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4',
              score >= 80
                ? 'border-emerald-500 text-emerald-400'
                : score >= 60
                ? 'border-yellow-500 text-yellow-400'
                : 'border-red-500 text-red-400'
            )}
          >
            {score}
          </div>
          <div className="flex-1">
            <p className={cn('font-semibold', getAtsColor(score))}>{label}</p>
            <Progress
              value={score}
              className={cn('mt-2 h-2 [&>div]:transition-all', getAtsBg(score))}
            />
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">Рекомендации:</p>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {score >= 70 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  )}
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

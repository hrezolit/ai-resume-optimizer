'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Wand2, Loader2, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PdfUploader } from '@/components/resume/pdf-uploader'
import { AtsScore } from '@/components/resume/ats-score'
import { ResumePdfDownload } from '@/components/resume/resume-pdf'
import { analyzeResume, saveManualResult } from '@/lib/actions/resume'
import { useToast } from '@/hooks/use-toast'
import type { AnalyzeResult } from '@/types'

const schema = z.object({
  vacancyText: z.string().min(50, 'Вставьте полное описание вакансии (минимум 50 символов)'),
})

type FormData = z.infer<typeof schema>

export default function GeneratePage() {
  const { toast } = useToast()
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [promptToShow, setPromptToShow] = useState<string | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [manualJson, setManualJson] = useState('')
  const [isSavingManual, setIsSavingManual] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [coverLetterTab, setCoverLetterTab] = useState('0')

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!resumeText) {
      toast({ title: 'Загрузите резюме', description: 'Пожалуйста, загрузите PDF с резюме', variant: 'destructive' })
      return
    }

    setIsAnalyzing(true)
    setResult(null)
    setPromptToShow(null)

    const res = await analyzeResume(resumeText, data.vacancyText)

    setIsAnalyzing(false)

    if (res.error) {
      toast({ title: 'Ошибка', description: res.error, variant: 'destructive' })
      return
    }

    if (res.result) {
      setResult(res.result)
      toast({ title: 'Готово!', description: 'Резюме оптимизировано успешно' })
    }

    if (res.prompt) {
      setPromptToShow(res.prompt)
      setShowPrompt(true)
    }
  }

  const copyPrompt = () => {
    if (promptToShow) {
      navigator.clipboard.writeText(promptToShow)
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    }
  }

  const handleSaveManual = async () => {
    if (!manualJson.trim()) {
      toast({ title: 'Вставьте ответ от Claude', variant: 'destructive' })
      return
    }
    setIsSavingManual(true)
    const res = await saveManualResult(resumeText, getValues('vacancyText'), manualJson)
    setIsSavingManual(false)

    if (res.error) {
      toast({ title: 'Ошибка', description: res.error, variant: 'destructive' })
      return
    }
    if (res.result) {
      setResult(res.result)
      setPromptToShow(null)
      toast({ title: 'Результат сохранён!' })
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-primary" />
          Оптимизация резюме
        </h1>
        <p className="text-muted-foreground mt-1">
          Загрузи резюме и вакансию — получи ATS-оптимизированный результат
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume upload */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">1. Твоё резюме</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PdfUploader onTextExtracted={setResumeText} />
              {resumeText && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Предпросмотр текста:</p>
                  <div className="p-3 rounded-lg bg-secondary/30 text-xs text-muted-foreground max-h-32 overflow-auto">
                    {resumeText.slice(0, 400)}...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vacancy */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">2. Текст вакансии</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="vacancy" className="sr-only">Текст вакансии</Label>
              <Textarea
                id="vacancy"
                placeholder="Вставьте полное описание вакансии — требования, обязанности, стек..."
                className="min-h-[200px] text-sm resize-none"
                {...register('vacancyText')}
              />
              {errors.vacancyText && (
                <p className="text-xs text-destructive mt-1">{errors.vacancyText.message}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="xl"
          className="w-full"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Анализируем и оптимизируем...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Анализировать и оптимизировать
            </>
          )}
        </Button>
      </form>

      {/* Prompt mode (no API key) */}
      {promptToShow && (
        <Card className="glass-card border-yellow-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-yellow-400">
                🔑 API ключ не настроен — используй ручной режим
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(!showPrompt)}
              >
                {showPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          {showPrompt && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Скопируй этот промпт, вставь его в{' '}
                  <a
                    href="https://claude.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    claude.ai <ExternalLink className="w-3 h-3" />
                  </a>
                  , а потом вставь JSON-ответ ниже.
                </p>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-secondary/50 text-xs overflow-auto max-h-48 whitespace-pre-wrap">
                    {promptToShow}
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={copyPrompt}
                  >
                    {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-json">Вставь JSON-ответ от Claude:</Label>
                <Textarea
                  id="manual-json"
                  placeholder={'{\n  "ats_score": 85,\n  "ats_recommendations": [...],\n  "optimized_resume": "...",\n  "cover_letters": [...]\n}'}
                  className="min-h-[120px] text-xs font-mono"
                  value={manualJson}
                  onChange={(e) => setManualJson(e.target.value)}
                />
                <Button
                  onClick={handleSaveManual}
                  disabled={isSavingManual}
                  className="w-full"
                >
                  {isSavingManual ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Сохраняем...</>
                  ) : (
                    'Применить результат'
                  )}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold">Результаты анализа</h2>

          {/* ATS Score */}
          <AtsScore score={result.ats_score} recommendations={result.ats_recommendations} />

          {/* Optimized Resume */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-base">Оптимизированное резюме</CardTitle>
                <ResumePdfDownload
                  resumeText={result.optimized_resume}
                  filename="resume-optimized-ai"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-secondary/30 text-sm whitespace-pre-wrap max-h-96 overflow-auto leading-relaxed">
                {result.optimized_resume}
              </div>
            </CardContent>
          </Card>

          {/* Cover Letters */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Сопроводительные письма</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={coverLetterTab} onValueChange={setCoverLetterTab}>
                <TabsList>
                  <TabsTrigger value="0">Формальное</TabsTrigger>
                  <TabsTrigger value="1">Живое / IT</TabsTrigger>
                </TabsList>
                {result.cover_letters.map((letter, i) => (
                  <TabsContent key={i} value={String(i)}>
                    <div className="relative">
                      <div className="p-4 rounded-lg bg-secondary/30 text-sm whitespace-pre-wrap leading-relaxed max-h-72 overflow-auto">
                        {letter}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          navigator.clipboard.writeText(letter)
                          toast({ title: 'Скопировано!' })
                        }}
                      >
                        <Copy className="w-3 h-3 mr-1" /> Копировать
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

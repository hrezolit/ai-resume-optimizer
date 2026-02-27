'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AtsScore } from '@/components/resume/ats-score'
import { ResumePdfDownload } from '@/components/resume/resume-pdf'
import { Eye, X, Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { Generation } from '@/types'

export function HistoryDetailModal({ generation }: { generation: Generation }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-3 h-3 mr-1" /> Открыть
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl border border-border bg-card shadow-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Dialog.Title className="text-lg font-semibold">{generation.title}</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Результаты оптимизации резюме
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <AtsScore
              score={generation.ats_score}
              recommendations={generation.ats_recommendations || []}
            />

            <Tabs defaultValue="resume">
              <TabsList>
                <TabsTrigger value="resume">Резюме</TabsTrigger>
                <TabsTrigger value="letter1">Письмо 1</TabsTrigger>
                <TabsTrigger value="letter2">Письмо 2</TabsTrigger>
              </TabsList>

              <TabsContent value="resume">
                <div className="space-y-2">
                  <div className="p-4 rounded-lg bg-secondary/30 text-sm whitespace-pre-wrap max-h-64 overflow-auto">
                    {generation.optimized_resume}
                  </div>
                  <ResumePdfDownload
                    resumeText={generation.optimized_resume}
                    filename="resume-from-history"
                  />
                </div>
              </TabsContent>

              {generation.cover_letters?.map((letter, i) => (
                <TabsContent key={i} value={`letter${i + 1}`}>
                  <div className="space-y-2">
                    <div className="p-4 rounded-lg bg-secondary/30 text-sm whitespace-pre-wrap max-h-64 overflow-auto">
                      {letter}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void
}

export function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const extractText = async (file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      // Dynamic import to avoid SSR issues
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .map((item: { str?: string }) => item.str || '')
          .join(' ')
        fullText += pageText + '\n'
      }

      if (!fullText.trim()) {
        setError('Не удалось извлечь текст. Возможно, PDF отсканирован. Скопируйте текст вручную.')
        return
      }

      onTextExtracted(fullText.trim())
      setFileName(file.name)
    } catch (err) {
      setError('Ошибка при обработке PDF. Проверьте формат файла.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf') {
        setError('Пожалуйста, загрузите файл в формате PDF')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер: 10 МБ')
        return
      }
      extractText(file)
    },
    []
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleClear = () => {
    setFileName(null)
    setError(null)
    onTextExtracted('')
  }

  return (
    <div className="space-y-2">
      {fileName ? (
        <div className="flex items-center gap-3 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
          <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm flex-1 truncate">{fileName}</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleClear}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <label
          className={cn(
            'flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed cursor-pointer transition-all',
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/50 hover:bg-secondary/30'
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleInputChange}
          />
          {isLoading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Извлекаем текст из PDF...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Перетащи PDF или нажми для выбора</p>
                <p className="text-xs text-muted-foreground mt-1">Максимум 10 МБ</p>
              </div>
            </>
          )}
        </label>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  )
}

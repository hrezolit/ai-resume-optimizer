'use client'

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    backgroundColor: '#ffffff',
    color: '#1a1a2e',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    borderBottomStyle: 'solid',
    paddingBottom: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    color: '#6b7280',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#bfdbfe',
    borderBottomStyle: 'solid',
    paddingBottom: 3,
    marginBottom: 8,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 10,
    color: '#3b82f6',
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 10,
    flex: 1,
    color: '#374151',
    lineHeight: 1.4,
  },
})

function parseResumeSections(text: string) {
  // Split resume text into lines and create simple sections
  const lines = text.split('\n').filter((l) => l.trim())
  const sections: { title: string; lines: string[] }[] = []
  let current: { title: string; lines: string[] } | null = null

  const sectionHeaders = [
    'ОПЫТ', 'ОБРАЗОВАНИЕ', 'НАВЫКИ', 'КОНТАКТЫ', 'ЦЕЛЬ', 'ДОСТИЖЕНИЯ',
    'ПРОЕКТЫ', 'ЯЗЫКИ', 'CERTIFICATIONS', 'SKILLS', 'EXPERIENCE',
    'EDUCATION', 'SUMMARY', 'PROFILE', 'КОНТАКТНАЯ', 'ОБ АВТОРЕ',
  ]

  for (const line of lines) {
    const upper = line.trim().toUpperCase()
    const isHeader = sectionHeaders.some((h) => upper.startsWith(h)) || 
      (line.trim().length < 40 && line.trim() === line.trim().toUpperCase() && line.trim().length > 3)

    if (isHeader) {
      if (current) sections.push(current)
      current = { title: line.trim(), lines: [] }
    } else {
      if (!current) current = { title: '', lines: [] }
      current.lines.push(line.trim())
    }
  }
  if (current) sections.push(current)
  return sections
}

function ResumePdfDocument({ resumeText }: { resumeText: string }) {
  const sections = parseResumeSections(resumeText)
  const firstName = sections[0]?.lines[0] || sections[0]?.title || 'Резюме'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{firstName}</Text>
          <Text style={styles.contact}>Оптимизировано с AI Resume Optimizer СНГ</Text>
        </View>

        {sections.map((section, idx) => {
          if (idx === 0 && !section.title) {
            return (
              <View key={idx} style={styles.section}>
                {section.lines.map((line, i) => (
                  <Text key={i} style={styles.text}>{line}</Text>
                ))}
              </View>
            )
          }
          return (
            <View key={idx} style={styles.section}>
              {section.title && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              )}
              {section.lines.map((line, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))}
            </View>
          )
        })}
      </Page>
    </Document>
  )
}

interface ResumePdfDownloadProps {
  resumeText: string
  filename?: string
}

export function ResumePdfDownload({ resumeText, filename = 'resume-optimized' }: ResumePdfDownloadProps) {
  return (
    <PDFDownloadLink
      document={<ResumePdfDocument resumeText={resumeText} />}
      fileName={`${filename}.pdf`}
    >
      {({ loading }) => (
        <Button variant="gradient" disabled={loading} className="gap-2">
          <Download className="w-4 h-4" />
          {loading ? 'Генерация PDF...' : 'Скачать PDF резюме'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}

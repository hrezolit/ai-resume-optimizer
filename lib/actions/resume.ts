'use server'

import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import type { AnalyzeResult } from '@/types'

const FREE_LIMIT = 3

function buildPrompt(resumeText: string, vacancyText: string): string {
  return `Ты — эксперт по карьерному консультированию и оптимизации резюме для рынка труда СНГ.

Проанализируй резюме кандидата и описание вакансии, затем:

1. Рассчитай ATS-совместимость (0-100) — насколько резюме подходит под данную вакансию по ключевым словам, навыкам и опыту.

2. Дай 3-5 конкретных рекомендаций по улучшению ATS-совместимости.

3. Напиши оптимизированную версию резюме, которая:
   - Содержит ключевые слова из вакансии
   - Имеет чёткую структуру: Контакты | Цель | Опыт | Образование | Навыки
   - Использует сильные глаголы действия
   - Адаптирована под конкретную вакансию

4. Напиши 2 варианта сопроводительного письма:
   - Формальный (для крупных компаний)
   - Живой/личный (для стартапов и IT)

РЕЗЮМЕ КАНДИДАТА:
${resumeText}

ОПИСАНИЕ ВАКАНСИИ:
${vacancyText}

Ответь СТРОГО в формате JSON (без markdown-обёртки):
{
  "ats_score": число от 0 до 100,
  "ats_recommendations": ["рекомендация 1", "рекомендация 2", ...],
  "optimized_resume": "полный текст оптимизированного резюме",
  "cover_letters": ["текст письма 1 (формальный)", "текст письма 2 (живой)"]
}`
}

export async function analyzeResume(
  resumeText: string,
  vacancyText: string
): Promise<{ result?: AnalyzeResult; prompt?: string; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Не авторизован' }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Профиль не найден' }

  // Check limits for free users
  if (profile.plan === 'free') {
    // Reset counter monthly
    const resetDate = new Date(profile.generations_reset_at)
    const now = new Date()
    if (
      now.getMonth() !== resetDate.getMonth() ||
      now.getFullYear() !== resetDate.getFullYear()
    ) {
      await supabase
        .from('profiles')
        .update({
          generations_used: 0,
          generations_reset_at: now.toISOString(),
        })
        .eq('id', user.id)
      profile.generations_used = 0
    }

    if (profile.generations_used >= FREE_LIMIT) {
      return {
        error: `Вы исчерпали лимит ${FREE_LIMIT} генерации в месяц для бесплатного тарифа. Перейдите на Pro для неограниченных генераций.`,
      }
    }
  }

  const prompt = buildPrompt(resumeText, vacancyText)

  // If no API key — return prompt for manual use
  if (!profile.anthropic_api_key) {
    return { prompt }
  }

  // Call Claude API
  try {
    const anthropic = new Anthropic({ apiKey: profile.anthropic_api_key })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return { error: 'Неожиданный ответ от Claude' }
    }

    let result: AnalyzeResult
    try {
      // Strip potential markdown code block
      const cleaned = content.text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim()
      result = JSON.parse(cleaned)
    } catch {
      return { error: 'Ошибка парсинга ответа Claude. Попробуйте ещё раз.' }
    }

    // Save to history
    const title =
      vacancyText.split('\n')[0].slice(0, 60) || 'Без названия'
    await supabase.from('generations').insert({
      user_id: user.id,
      title,
      resume_text: resumeText,
      vacancy_text: vacancyText,
      ats_score: result.ats_score,
      ats_recommendations: result.ats_recommendations,
      optimized_resume: result.optimized_resume,
      cover_letters: result.cover_letters,
      status: 'completed',
    })

    // Increment usage counter
    await supabase
      .from('profiles')
      .update({ generations_used: profile.generations_used + 1 })
      .eq('id', user.id)

    return { result }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
    return { error: `Ошибка Claude API: ${msg}` }
  }
}

export async function saveManualResult(
  resumeText: string,
  vacancyText: string,
  manualJson: string
): Promise<{ result?: AnalyzeResult; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Не авторизован' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Профиль не найден' }

  if (profile.plan === 'free' && profile.generations_used >= FREE_LIMIT) {
    return { error: 'Лимит генераций исчерпан' }
  }

  let result: AnalyzeResult
  try {
    const cleaned = manualJson
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
    result = JSON.parse(cleaned)
  } catch {
    return { error: 'Неверный формат JSON. Убедитесь, что вставили полный ответ от Claude.' }
  }

  const title = vacancyText.split('\n')[0].slice(0, 60) || 'Без названия'
  await supabase.from('generations').insert({
    user_id: user.id,
    title,
    resume_text: resumeText,
    vacancy_text: vacancyText,
    ats_score: result.ats_score,
    ats_recommendations: result.ats_recommendations,
    optimized_resume: result.optimized_resume,
    cover_letters: result.cover_letters,
    status: 'completed',
  })

  await supabase
    .from('profiles')
    .update({ generations_used: profile.generations_used + 1 })
    .eq('id', user.id)

  return { result }
}

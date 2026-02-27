export type Plan = 'free' | 'pro'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  plan: Plan
  generations_used: number
  generations_reset_at: string
  anthropic_api_key: string | null
  pro_activated_at: string | null
  created_at: string
}

export interface Generation {
  id: string
  user_id: string
  title: string
  resume_text: string
  vacancy_text: string
  ats_score: number
  ats_recommendations: string[]
  optimized_resume: string
  cover_letters: string[]
  status: 'completed' | 'failed' | 'pending'
  created_at: string
}

export interface AnalyzeResult {
  ats_score: number
  ats_recommendations: string[]
  optimized_resume: string
  cover_letters: string[]
}

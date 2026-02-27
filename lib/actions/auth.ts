'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    await supabase.from('profiles').upsert({
      id: authData.user.id,
      email,
      full_name,
      plan: 'free',
      generations_used: 0,
      generations_reset_at: new Date().toISOString(),
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function saveApiKey(apiKey: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Не авторизован' }

  const { error } = await supabase
    .from('profiles')
    .update({ anthropic_api_key: apiKey })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}

export async function updateProfile(data: {
  full_name: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Не авторизован' }

  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/profile')
  return { success: true }
}

export async function activateProCode(code: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Не авторизован' }

  // Check activation code in database
  const { data: codeData } = await supabase
    .from('activation_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .single()

  if (!codeData) {
    return { error: 'Код активации недействителен или уже использован' }
  }

  // Mark code as used
  await supabase
    .from('activation_codes')
    .update({ used: true, used_by: user.id, used_at: new Date().toISOString() })
    .eq('code', code)

  // Upgrade user to pro
  await supabase
    .from('profiles')
    .update({ plan: 'pro', pro_activated_at: new Date().toISOString() })
    .eq('id', user.id)

  revalidatePath('/profile')
  revalidatePath('/dashboard')
  return { success: true }
}

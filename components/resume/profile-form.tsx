'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { saveApiKey, updateProfile, activateProCode } from '@/lib/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Key, User, Zap, Loader2, Shield } from 'lucide-react'
import type { Profile } from '@/types'

interface ProfileFormProps {
  profile: Profile
  email: string
}

const profileSchema = z.object({
  full_name: z.string().min(2, 'Минимум 2 символа'),
})

const apiKeySchema = z.object({
  api_key: z.string().startsWith('sk-ant-', 'Ключ должен начинаться с sk-ant-'),
})

const proCodeSchema = z.object({
  code: z.string().min(4, 'Введите код активации'),
})

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const { toast } = useToast()
  const [showApiKey, setShowApiKey] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingKey, setIsSavingKey] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  const profileForm = useForm({ resolver: zodResolver(profileSchema), defaultValues: { full_name: profile?.full_name || '' } })
  const apiKeyForm = useForm({ resolver: zodResolver(apiKeySchema), defaultValues: { api_key: '' } })
  const proCodeForm = useForm({ resolver: zodResolver(proCodeSchema), defaultValues: { code: '' } })

  const onSaveProfile = async (data: { full_name: string }) => {
    setIsSavingProfile(true)
    const res = await updateProfile(data)
    setIsSavingProfile(false)
    if (res.error) toast({ title: 'Ошибка', description: res.error, variant: 'destructive' })
    else toast({ title: 'Профиль обновлён!' })
  }

  const onSaveApiKey = async (data: { api_key: string }) => {
    setIsSavingKey(true)
    const res = await saveApiKey(data.api_key)
    setIsSavingKey(false)
    if (res.error) toast({ title: 'Ошибка', description: res.error, variant: 'destructive' })
    else {
      toast({ title: 'API ключ сохранён!' })
      apiKeyForm.reset()
    }
  }

  const onActivatePro = async (data: { code: string }) => {
    setIsActivating(true)
    const res = await activateProCode(data.code)
    setIsActivating(false)
    if (res.error) toast({ title: 'Ошибка', description: res.error, variant: 'destructive' })
    else toast({ title: '🎉 Pro активирован!', description: 'Добро пожаловать в Pro!' })
  }

  return (
    <div className="space-y-6">
      {/* Plan status */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Текущий тариф
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profile?.plan === 'pro' ? (
                <Badge variant="pro">⚡ Pro</Badge>
              ) : (
                <Badge variant="secondary">Free</Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {profile?.plan === 'free'
                  ? `${profile.generations_used}/3 генераций использовано в этом месяце`
                  : 'Неограниченные генерации'}
              </span>
            </div>
            {profile?.plan === 'free' && (
              <a
                href={process.env.NEXT_PUBLIC_BOOSTY_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gradient" size="sm">
                  <Zap className="w-3 h-3 mr-1" />
                  Купить Pro на Boosty
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Личные данные
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled className="opacity-60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Полное имя</Label>
              <Input id="full_name" placeholder="Иван Иванов" {...profileForm.register('full_name')} />
              {profileForm.formState.errors.full_name && (
                <p className="text-xs text-destructive">{profileForm.formState.errors.full_name.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isSavingProfile} size="sm">
              {isSavingProfile ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Сохранение...</> : 'Сохранить'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            Anthropic API ключ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Добавь свой API ключ с{' '}
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              console.anthropic.com
            </a>{' '}
            для автоматической оптимизации через Claude. Ключ виден только тебе.
          </p>

          {profile?.anthropic_api_key && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm text-emerald-400">API ключ подключён</span>
            </div>
          )}

          <form onSubmit={apiKeyForm.handleSubmit(onSaveApiKey)} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="api_key">
                {profile?.anthropic_api_key ? 'Обновить API ключ' : 'API ключ'}
              </Label>
              <div className="relative">
                <Input
                  id="api_key"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="sk-ant-api03-..."
                  className="pr-10"
                  {...apiKeyForm.register('api_key')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {apiKeyForm.formState.errors.api_key && (
                <p className="text-xs text-destructive">{apiKeyForm.formState.errors.api_key.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isSavingKey} size="sm">
              {isSavingKey ? <><Loader2 className="w-3 h-3 animate-spin mr-1" />Сохранение...</> : 'Сохранить ключ'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pro activation */}
      {profile?.plan === 'free' && (
        <Card className="glass-card border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Активация Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Купи Pro на{' '}
              <a
                href={process.env.NEXT_PUBLIC_BOOSTY_URL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Boosty
              </a>{' '}
              и введи полученный код активации.
            </p>
            <form onSubmit={proCodeForm.handleSubmit(onActivatePro)} className="flex gap-3">
              <Input
                placeholder="Код активации"
                className="flex-1"
                {...proCodeForm.register('code')}
              />
              <Button type="submit" variant="gradient" disabled={isActivating}>
                {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Активировать'}
              </Button>
            </form>
            {proCodeForm.formState.errors.code && (
              <p className="text-xs text-destructive">{proCodeForm.formState.errors.code.message}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

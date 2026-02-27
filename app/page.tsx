import Link from 'next/link'
import {
  FileText, Wand2, TrendingUp, Mail, CheckCircle2, Star,
  ArrowRight, Zap, Shield, Clock, Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const features = [
  {
    icon: FileText,
    title: 'Загрузка PDF резюме',
    desc: 'Просто перетащи PDF — текст извлечётся автоматически прямо в браузере.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: TrendingUp,
    title: 'ATS-анализ',
    desc: 'Узнай процент совместимости с конкретной вакансией и получи точечные рекомендации.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Wand2,
    title: 'Оптимизация резюме',
    desc: 'Claude AI перепишет резюме с учётом ключевых слов вакансии, сохраняя твой опыт.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Mail,
    title: 'Сопроводительные письма',
    desc: '2 варианта письма — формальное для корпораций и живое для стартапов.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Безопасность данных',
    desc: 'Твои данные защищены через Supabase RLS — никто кроме тебя не видит твои резюме.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    icon: Clock,
    title: 'История генераций',
    desc: 'Все оптимизации сохраняются — вернись к любой версии в любой момент.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
]

const testimonials = [
  {
    name: 'Алексей Петров',
    role: 'Frontend Developer',
    city: 'Москва',
    text: 'Отправил 20 резюме и тишина. После оптимизации первые 3 отклика уже через день. ATS-совместимость выросла с 45% до 87%.',
    score: '87%',
  },
  {
    name: 'Анна Смирнова',
    role: 'Product Manager',
    city: 'Алматы',
    text: 'Инструмент буквально переписал моё резюме под вакансию. Получила оффер в международную компанию за 2 недели.',
    score: '92%',
  },
  {
    name: 'Дмитрий Ким',
    role: 'Data Analyst',
    city: 'Ташкент',
    text: 'Сопроводительные письма — огонь! Скопировал и немного доработал. HR сказал, что письмо выделилось среди 200 кандидатов.',
    score: '79%',
  },
]

const plans = [
  {
    name: 'Free',
    price: '0 ₽',
    period: '/навсегда',
    features: [
      '3 генерации в месяц',
      'ATS-анализ',
      'Оптимизация резюме',
      'Сопроводительные письма',
      'История генераций',
      'Скачивание PDF',
    ],
    cta: 'Начать бесплатно',
    href: '/auth/register',
    gradient: false,
  },
  {
    name: 'Pro',
    price: 'от 299 ₽',
    period: '/месяц',
    features: [
      'Неограниченные генерации',
      'Всё из Free',
      'Приоритетные шаблоны',
      'Экспорт в Word',
      'Приоритетная поддержка',
      'Ранний доступ к функциям',
    ],
    cta: 'Купить на Boosty',
    href: process.env.NEXT_PUBLIC_BOOSTY_URL || '#',
    gradient: true,
    external: true,
  },
]

const steps = [
  { num: '01', title: 'Загрузи резюме', desc: 'Перетащи PDF или выбери файл' },
  { num: '02', title: 'Вставь вакансию', desc: 'Скопируй описание вакансии целиком' },
  { num: '03', title: 'Получи результат', desc: 'Claude оптимизирует за секунды' },
  { num: '04', title: 'Скачай PDF', desc: 'Готовое ATS-резюме в один клик' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">ResumeAI СНГ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Войти</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="gradient" size="sm">Начать бесплатно</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
            🚀 Powered by Claude AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Оптимизируй резюме{' '}
            <span className="gradient-text">под любую вакансию</span>{' '}
            за секунды
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Загрузи PDF резюме, вставь текст вакансии — получи ATS-оптимизированное резюме
            и готовые сопроводительные письма. Больше откликов, больше интервью.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="gradient" size="xl" className="gap-2 w-full sm:w-auto">
                <Wand2 className="w-5 h-5" />
                Начать бесплатно
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl" className="gap-2 w-full sm:w-auto">
                Как это работает
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Бесплатно • 3 генерации в месяц • Без карты
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {[
              { val: '10 000+', label: 'резюме оптимизировано' },
              { val: '3.2x', label: 'больше откликов' },
              { val: '89%', label: 'средний ATS-скор' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{stat.val}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-secondary/20" id="how-it-works">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Как это работает</h2>
            <p className="text-muted-foreground">4 шага до оффера</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative text-center p-6 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 transition-colors">
                <div className="text-4xl font-black gradient-text mb-3">{step.num}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" id="features">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Всё что нужно для поиска работы</h2>
            <p className="text-muted-foreground">Мощные инструменты в одном месте</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title} className="glass-card hover:border-primary/20 transition-colors group">
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-secondary/20" id="testimonials">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Что говорят пользователи</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">4.9 из 5</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <Card key={t.name} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} • {t.city}</p>
                    </div>
                    <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 text-xs">
                      ATS {t.score}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4" id="pricing">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Простые цены</h2>
            <p className="text-muted-foreground">Начни бесплатно, перейди на Pro когда готов</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`glass-card relative ${plan.gradient ? 'border-blue-500/40' : ''}`}
              >
                {plan.gradient && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="pro" className="px-3">✨ Популярный</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {plan.external ? (
                    <a href={plan.href} target="_blank" rel="noopener noreferrer">
                      <Button variant="gradient" className="w-full">
                        <Zap className="w-4 h-4" />
                        {plan.cta}
                      </Button>
                    </a>
                  ) : (
                    <Link href={plan.href}>
                      <Button variant={plan.gradient ? 'gradient' : 'outline'} className="w-full">
                        {plan.cta}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <div className="p-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20">
            <h2 className="text-3xl font-bold mb-4">
              Готов получить больше интервью?
            </h2>
            <p className="text-muted-foreground mb-8">
              Зарегистрируйся за 30 секунд и оптимизируй первое резюме прямо сейчас
            </p>
            <Link href="/auth/register">
              <Button variant="gradient" size="xl" className="gap-2">
                <Wand2 className="w-5 h-5" />
                Начать бесплатно
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <FileText className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm gradient-text">ResumeAI СНГ</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 ResumeAI СНГ. Сделано с ❤️ для рынка труда СНГ.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/auth/login" className="hover:text-foreground transition-colors">Войти</Link>
            <Link href="/auth/register" className="hover:text-foreground transition-colors">Регистрация</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

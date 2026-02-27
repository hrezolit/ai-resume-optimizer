# AI Resume Optimizer СНГ 🚀

Современное SaaS-приложение для оптимизации резюме под конкретные вакансии с помощью Claude AI.

## Функционал

- **Загрузка PDF** — извлечение текста прямо в браузере через pdf.js
- **ATS-анализ** — процент совместимости + рекомендации по улучшению
- **Оптимизация резюме** — Claude AI адаптирует резюме под вакансию
- **Сопроводительные письма** — 2 варианта: формальный и живой
- **Скачивание PDF** — красивый PDF через @react-pdf/renderer
- **История** — все генерации сохраняются в Supabase
- **Монетизация** — Free (3/мес) + Pro через Boosty с кодами активации

---

## Стек

- **Next.js 15** (App Router + Server Actions)
- **TypeScript** + **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth, PostgreSQL, RLS)
- **@anthropic-ai/sdk** — вызов Claude Sonnet
- **pdfjs-dist** — извлечение текста из PDF (client-side)
- **@react-pdf/renderer** — генерация красивых PDF
- **react-hook-form** + **zod** — формы и валидация

---

## Быстрый старт

### 1. Клонирование

```bash
git clone https://github.com/your-username/ai-resume-optimizer
cd ai-resume-optimizer
npm install
```

### 2. Настройка Supabase

1. Создай проект на [supabase.com](https://supabase.com)
2. В SQL Editor выполни содержимое файла `supabase/schema.sql`
3. В настройках проекта найди:
   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` — service_role key (секретный!)

### 3. Настройка переменных окружения

```bash
cp .env.local.example .env.local
```

Заполни `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BOOSTY_URL=https://boosty.to/your-page
```

### 4. Запуск

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

---

## Деплой на Vercel

### 1. Подключи репозиторий

```bash
# Залей в GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/your-username/ai-resume-optimizer
git push -u origin main
```

### 2. Импортируй в Vercel

1. Зайди на [vercel.com](https://vercel.com)
2. "New Project" → импортируй репозиторий с GitHub
3. Framework Preset: **Next.js** (определится автоматически)

### 3. Добавь переменные окружения в Vercel

В настройках проекта → "Environment Variables" добавь:

| Переменная | Значение |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL твоего Supabase проекта |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon ключ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role ключ |
| `NEXT_PUBLIC_APP_URL` | https://your-app.vercel.app |
| `NEXT_PUBLIC_BOOSTY_URL` | https://boosty.to/your-page |

### 4. Deploy!

Нажми "Deploy" — Vercel соберёт и задеплоит приложение.

---

## Настройка Supabase Auth

### Разрешённые URL для редиректов

В Supabase → Authentication → URL Configuration добавь:

```
http://localhost:3000/**
https://your-app.vercel.app/**
```

### Email настройки (опционально)

По умолчанию Supabase отправляет письмо подтверждения. Для быстрого тестирования можно отключить в:
Authentication → Email Templates → Confirm email → отключи "Confirm email"

---

## Добавление кодов активации Pro

В Supabase SQL Editor:

```sql
INSERT INTO public.activation_codes (code) VALUES
  ('PRO-ВАШ-КОД-001'),
  ('PRO-ВАШ-КОД-002');
```

Раздавай коды покупателям на Boosty.

---

## Структура проекта

```
ai-resume-optimizer/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css
│   ├── auth/
│   │   ├── login/page.tsx          # Страница входа
│   │   └── register/page.tsx       # Регистрация
│   └── (dashboard)/
│       ├── layout.tsx              # Dashboard layout с навигацией
│       ├── dashboard/page.tsx      # Дашборд
│       ├── generate/page.tsx       # Оптимизация резюме
│       ├── history/page.tsx        # История генераций
│       └── profile/page.tsx        # Профиль
├── components/
│   ├── ui/                         # shadcn/ui компоненты
│   ├── layout/                     # Навигация, провайдеры
│   └── resume/                     # Компоненты резюме
├── lib/
│   ├── actions/
│   │   ├── auth.ts                 # Server actions для авторизации
│   │   └── resume.ts               # Server action для анализа Claude
│   ├── supabase/                   # Клиенты Supabase
│   └── utils.ts
├── types/index.ts
├── middleware.ts                   # Auth middleware
└── supabase/schema.sql             # SQL для Supabase
```

---

## Как работает режим без API ключа

Если у пользователя не настроен Anthropic API ключ, приложение:
1. Формирует идеальный промпт для Claude
2. Показывает его пользователю с кнопкой "Копировать"
3. Пользователь идёт на claude.ai, вставляет промпт, копирует JSON-ответ
4. Вставляет ответ обратно в приложение
5. Приложение форматирует результат и сохраняет в историю

---

## Лицензия

MIT

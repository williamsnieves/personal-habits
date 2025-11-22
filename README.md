# Personal Habits Tracker 📊

A modern, full-stack habit tracking application built with Next.js, featuring AI-powered insights, real-time weather integration, and a beautiful, responsive UI.

## 🎯 Main Goal

Help users build and maintain positive habits through:
- **Visual Progress Tracking**: GitHub-style heatmap calendar showing habit completion history
- **AI-Powered Insights**: Personalized recommendations and habit suggestions using OpenAI
- **Smart Reminders**: Track daily and weekly habits with completion status
- **Gamification**: Streaks, statistics, and motivational features

## ✨ Active Features

### Core Features
- ✅ **Habit Management**: Create, update, delete, and track habits
- ✅ **Completion Logging**: Mark habits as completed or skipped
- ✅ **Calendar Visualization**: Interactive heatmap showing habit history
- ✅ **Statistics Dashboard**: View streaks, completion rates, and trends

### Integrations
- 🤖 **AI Assistant**: OpenAI-powered habit coaching and suggestions
- 🌤️ **Weather Widget**: Real-time weather data from OpenWeatherMap
- 🎵 **Spotify Integration**: Embedded music player for focus sessions
- 📚 **Popular Habits**: Browse and add community-recommended habits

### Technical Features
- 🔐 **Type-Safe API**: Full TypeScript coverage with Zod validation
- 🗄️ **PostgreSQL Database**: Supabase-hosted for scalability
- 🧪 **Comprehensive Testing**: 28 passing tests with Jest & React Testing Library
- 🎨 **Modern UI**: Tailwind CSS with smooth animations and responsive design

## 🏗️ Architecture

### Backend Structure (Domain-Driven Design)

```
src/
├── core/
│   ├── domain/           # Business logic & entities
│   │   ├── habit.ts      # Habit domain model & interfaces
│   │   ├── calendar.ts   # Calendar calculations
│   │   └── validation.ts # Zod schemas for validation
│   └── errors/
│       └── AppError.ts   # Custom error classes
│
├── application/
│   └── use-cases/        # Application business rules
│       ├── create-habit.use-case.ts
│       ├── update-habit.use-case.ts
│       ├── delete-habit.use-case.ts
│       ├── list-habits.use-case.ts
│       └── log-habit.use-case.ts
│
├── infrastructure/
│   └── repositories/     # Data access layer
│       └── prisma-habit.repository.ts
│
└── app/api/              # Next.js API routes
    ├── habits/
    │   ├── route.ts      # GET, POST /api/habits
    │   ├── [id]/
    │   │   ├── route.ts  # GET, PUT, DELETE /api/habits/:id
    │   │   └── log/
    │   │       └── route.ts  # POST /api/habits/:id/log
    │   ├── calendar/
    │   │   └── route.ts  # GET /api/habits/calendar
    │   └── popular/
    │       └── route.ts  # GET /api/habits/popular
    ├── ai/
    │   └── suggestions/
    │       └── route.ts  # POST /api/ai/suggestions
    └── weather/
        └── route.ts      # GET /api/weather
```

**Key Principles:**
- **Domain-Driven Design (DDD)**: Clear separation between domain, application, and infrastructure layers
- **SOLID Principles**: Single responsibility, dependency inversion
- **Repository Pattern**: Abstract data access behind interfaces
- **Use Cases**: Encapsulate business logic in reusable units

### Frontend Structure (Component-Based)

```
src/
├── components/           # React components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── HabitList.tsx
│   ├── CalendarWidget.tsx
│   ├── WeatherWidget.tsx
│   ├── AIAssistantCards.tsx
│   ├── PopularHabitsModal.tsx
│   ├── ShouldDoCard.tsx
│   ├── SpotifyWidget.tsx
│   ├── NewHabitModal.tsx
│   └── __tests__/       # Component tests
│
├── hooks/                # Custom React hooks
│   └── useHabits.ts     # Habit CRUD operations
│
├── lib/                  # Utilities & helpers
│   ├── api-client.ts    # Type-safe fetch wrapper
│   ├── api-error-handler.ts  # Error handling utilities
│   └── prisma.ts        # Prisma client singleton
│
└── app/
    ├── page.tsx         # Main dashboard
    ├── layout.tsx       # Root layout
    └── globals.css      # Global styles
```

**Key Patterns:**
- **Custom Hooks**: Separate logic from UI (`useHabits`)
- **API Client**: Centralized, type-safe data fetching
- **Component Composition**: Small, reusable components
- **Optimistic Updates**: Immediate UI feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (recommended: 22.14.0)
- npm or yarn
- Supabase account (for PostgreSQL database)
- OpenAI API key (optional, for AI features)
- OpenWeatherMap API key (optional, for weather widget)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-habits
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your credentials (see [Environment Variables](#environment-variables))

4. **Run database migrations**
   ```bash
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

See [`.env.example`](.env.example) for all required and optional variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Supabase PostgreSQL connection string (Transaction Pooler) |
| `DIRECT_URL` | ✅ | Supabase direct connection (for migrations) |
| `OPENAI_API_KEY` | ⚠️ | OpenAI API key for AI features (falls back to mock data) |
| `OPENWEATHER_API_KEY` | ⚠️ | OpenWeatherMap API key (falls back to mock data) |
| `WEATHER_CITY` | ❌ | City for weather widget (default: Madrid) |

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📦 Tech Stack

### Core
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma

### Frontend
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend
- **Validation**: Zod
- **API**: Next.js API Routes
- **Architecture**: Domain-Driven Design (DDD)

### External Services
- **AI**: OpenAI GPT-4
- **Weather**: OpenWeatherMap API
- **Music**: Spotify Embed

### Development
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
personal-habits/
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   ├── core/                 # Domain layer (DDD)
│   ├── application/          # Use cases (DDD)
│   └── infrastructure/       # Data access (DDD)
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspiration from modern productivity apps
- Icons by [Lucide](https://lucide.dev/)
- AI powered by [OpenAI](https://openai.com/)

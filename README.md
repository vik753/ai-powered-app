# AI-Powered Product Reviews App

This project is a full-stack application designed to manage and summarize product reviews using AI. It features a React-based frontend and an Express-based backend, integrated within a Bun-managed monorepo.

## 🏗 Architecture & Tech Stack

### Monorepo
- **Runtime**: [Bun](https://bun.sh/)
- **Workspaces**: Managed via `package.json` workspaces.
- **Orchestration**: `concurrently` is used to run both client and server from the root.

### Frontend (`packages/client`)
- **Framework**: React 18+ with Vite.
- **Styling**: Tailwind CSS & Radix UI.
- **Data Fetching**: TanStack Query (React Query) for caching and server-state management.
- **UI Components**: shadcn/ui (Radix UI + Tailwind).

### Backend (`packages/server`)
- **Framework**: Express.js.
- **Database**: MySQL.
- **ORM**: Prisma.
- **AI Integration**: OpenAI GPT models for text generation and summarization.
- **Design Pattern**: Controller-Service-Repository pattern for clear separation of concerns.

## 🚀 Key Features

- **Product Reviews**: Fetch and display reviews for products including ratings and timestamps.
- **AI Summarization**: Generate concise summaries of multiple user reviews using OpenAI, focusing on main pros and cons.
- **Intelligent Caching**: AI summaries are cached in the database with an expiration policy to optimize performance and LLM costs.
- **Chat Support**: Backend infrastructure ready for AI-powered chat interactions.

## 📁 Project Structure

```text
ai-powered-app/
├── packages/
│   ├── client/          # Vite + React Frontend
│   │   ├── src/
│   │   │   ├── components/ # React components (Reviews, UI, etc.)
│   │   │   └── lib/        # Utilities and shared logic
│   └── server/          # Express + Prisma Backend
│       ├── controllers/  # API route handlers
│       ├── services/     # Business logic & AI orchestration
│       ├── repositories/ # Database access layer
│       ├── prisma/       # Schema definition and migrations
│       ├── llm/          # OpenAI client configuration
│       └── prompts/      # AI prompt templates
├── index.ts              # Root entry point for development
└── package.json          # Workspace configuration
```

## 🛠 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed.
- MySQL database.
- OpenAI API Key.

### Installation
```bash
bun install
```

### Configuration
1. Navigate to `packages/server/`.
2. Create a `.env` file based on the environment requirements:
```env
DATABASE_URL="mysql://user:password@localhost:3306/ai_powered_app"
OPENAI_API_KEY="your-openai-api-key"
```

### Running Locally
From the root directory, run:
```bash
bun dev
```
This will start both the backend (typically on port 3000) and the frontend (typically on port 5173) simultaneously.

## 🛠 Maintenance & Technical Debt
- **Type Safety**: The project uses TypeScript throughout, but some areas can benefit from stricter type definitions.
- **Refactoring**: Repository naming typo (`converstation.repository.ts`) should be corrected.
- **Testing**: Implementation of Vitest for frontend and Jest/Supertest for backend is recommended.
- **Features**: The Chat UI is currently under development and not yet fully integrated into the main view.

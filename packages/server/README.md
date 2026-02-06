# Server Package

Backend for the AI-Powered Product Reviews App, built with Express.js and Bun.

## 🛠 Tech Stack
- **Runtime**: Bun
- **Framework**: Express.js (v5)
- **Database**: MySQL
- **ORM**: Prisma
- **AI**: OpenAI API
- **Validation**: Zod (planned/partially implemented)

## 📁 Structure
- `/controllers`: API endpoints and request handling.
- `/services`: Core business logic and AI orchestration.
- `/repositories`: Database interactions via Prisma.
- `/prisma`: Schema definition and migrations.
- `/llm`: OpenAI client configuration.
- `/prompts`: Templates for AI generation.

## 🚀 Getting Started

### Environment Variables
Create a `.env` file:
```env
DATABASE_URL="mysql://user:password@localhost:3306/db"
OPENAI_API_KEY="sk-..."
```

### Scripts
- `bun run dev`: Start with hot reload.
- `bun run start`: Start the server.

## 📝 API Endpoints
- `POST /api/chat`: AI chat interaction.
- `GET /api/products/:id/reviews`: Get product reviews.
- `POST /api/products/:id/reviews/summarize`: Trigger/get AI summary of reviews.

# Todo App

Full-stack todo application with categories. npm monorepo with separate `frontend` and `backend` workspaces.

## Stack

| | |
|---|---|
| **Frontend** | React 19, Vite 6, TypeScript, Tailwind CSS v4, React Hook Form, Zod v4, Axios, Sonner |
| **Backend** | Express 4, TypeScript (ESM), Prisma v7, SQLite via `better-sqlite3` |

## Requirements

- Node.js **≥ 20.19.0** (Prisma v7 hard requirement)
- npm ≥ 9

---

## Running locally

### 1. Install

```bash
npm install
```

### 2. Set up the database

```bash
cd backend
npm run db:setup        # migrate + seed (runs once)
```

Seed creates five categories: `Work`, `Personal`, `Shopping`, `Health`, `Learning`.

### 3. Start

```bash
# from repo root — starts both servers via concurrently
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |

Or individually:

```bash
npm run dev:frontend
npm run dev:backend
```

---

## Environment variables

### `backend/.env`

```env
DATABASE_URL=file:./prisma/dev.db
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### `frontend/.env

```env
VITE_API_URL=http://localhost:3001
```

---

## API

```
GET    /todos              ?category=<id>  optional filter
POST   /todos              { text, categoryId }
PATCH  /todos/:id          { completed: boolean }
DELETE /todos/:id
GET    /categories
GET    /health
```

Business rule: max **5 todos per category** — enforced by the service layer, returns `400` with a message on violation.

---

## Project structure

```
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Category + Todo models
│   │   └── seed.ts
│   ├── prisma.config.ts        # Prisma v7: DB URL lives here, not in schema
│   └── src/
│       ├── routes/             # Express routers
│       ├── controllers/        # Zod validation → call service → respond
│       ├── services/           # Business logic (category limit)
│       ├── repos/              # Prisma queries, return Result<T, Error>
│       ├── schemas/            # Zod request schemas
│       └── utils/
│           ├── result.utils.ts # Result<T,E> type + match/success/failure
│           ├── validate.utils.ts # parseBody / parseParams / parseQuery
│           └── http.utils.ts   # ServiceError → HTTP status mapping
│
└── frontend/
    └── src/
        ├── features/
        │   ├── todo/           
        │   └── category/       
        ├── lib/
        │   ├── api/            
        │   ├── cn.ts           
        │   └── undo-toast.ts   
        └── types/              
```

---

## Useful backend scripts

```bash
npm run db:generate     # re-generate Prisma client after schema changes
npm run db:migrate      # create + apply new migration
npm run db:seed         # seed categories (idempotent)
npm run db:studio       # open Prisma Studio at http://localhost:5555
npm run typecheck
```

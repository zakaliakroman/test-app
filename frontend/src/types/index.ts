// ─── Domain types ─────────────────────────────────────────────────────────────
// These mirror the Prisma models returned by the backend API.

export interface Category {
  id: number;
  name: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  /** ISO 8601 string — cast to Date where needed */
  createdAt: string;
  categoryId: number;
  category: Category;
}

// ─── API input types ──────────────────────────────────────────────────────────

export interface CreateTodoInput {
  text: string;
  categoryId: number;
}

export interface UpdateTodoInput {
  completed: boolean;
}

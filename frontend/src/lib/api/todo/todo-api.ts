import { CreateTodoInput, Todo } from "@/types";
import { apiClient } from "../api-client";


export const todoApi = {
  getAll: (categoryId?: number, signal?: AbortSignal): Promise<Todo[]> =>
    apiClient
      .get<Todo[]>("/todos", {
        params: categoryId ? { category: categoryId } : undefined,
        signal,
      })
      .then((r) => r.data),

  create: (data: CreateTodoInput): Promise<Todo> =>
    apiClient.post<Todo>("/todos", data).then((r) => r.data),

  update: (id: number, completed: boolean): Promise<Todo> =>
    apiClient.patch<Todo>(`/todos/${id}`, { completed }).then((r) => r.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/todos/${id}`).then(() => undefined),
};

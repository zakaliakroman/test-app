import { useState, useEffect, useCallback, type RefObject } from "react";
import { isCancel } from "axios";
import type { Todo } from "@/types";
import type { PendingEntry } from "../todo.types";
import { todoApi } from "@/lib/api/todo/todo-api";


function useTodoList(
  selectedCategoryId: number | null,
  pendingDeletes: RefObject<Map<number, PendingEntry>>,
) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(
    async (signal: AbortSignal) => {
      try {
        setError(null);
        const data = await todoApi.getAll(selectedCategoryId ?? undefined, signal);
        const hiddenIds = new Set(pendingDeletes.current.keys());
        setTodos(data.filter((t) => !hiddenIds.has(t.id)));
      } catch (err) {
        // Ignore Axios CanceledError
        if (isCancel(err)) return;
        setError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategoryId, pendingDeletes],
  );

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetchTodos(controller.signal);
    return () => controller.abort();
  }, [fetchTodos]);

  return { todos, setTodos, isLoading, error };
}

export { useTodoList };

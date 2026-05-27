import {
  useCallback,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import type { Todo, CreateTodoInput } from "@/types";
import type { PendingEntry } from "../todo.types";
import { todoApi } from "@/lib/api/todo/todo-api";
import { scheduleUndoToast, showUndoToast, UNDO_DELAY_MS } from "@/lib/undo-toast";

interface Params {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  selectedIds: Set<number>;
  setSelectedIds: Dispatch<SetStateAction<Set<number>>>;
  pendingDeletes: MutableRefObject<Map<number, PendingEntry>>;
  pendingCompletes: MutableRefObject<Map<number, ReturnType<typeof setTimeout>>>;
}

function useTodoActions({
  todos,
  setTodos,
  selectedIds,
  setSelectedIds,
  pendingDeletes,
  pendingCompletes,
}: Params) {
  const createTodo = useCallback(
    async (data: CreateTodoInput): Promise<void> => {
      const newTodo = await todoApi.create(data);
      setTodos((prev) => [newTodo, ...prev]);
      toast.success("Task created");
    },
    [setTodos],
  );

  const completeTodo = useCallback(
    async (id: number): Promise<void> => {
      if (pendingCompletes.current.has(id)) return;

      await todoApi.update(id, true);
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      const timer = scheduleUndoToast({
        message: "Task marked as done",
        onCommit: async () => {
          pendingCompletes.current.delete(id);
          try {
            await todoApi.delete(id);
          } catch {
            toast.error("Failed to remove completed task");
          }
          setTodos((prev) => prev.filter((t) => t.id !== id));
        },
        onUndo: async () => {
          pendingCompletes.current.delete(id);
          try {
            await todoApi.update(id, false);
            setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: false } : t)));
          } catch {
            toast.error("Failed to undo");
          }
        },
      });

      pendingCompletes.current.set(id, timer);
    },
    [pendingCompletes, setTodos, setSelectedIds],
  );

  const deleteTodo = useCallback(
    (todo: Todo): void => {
      const completeTimer = pendingCompletes.current.get(todo.id);
      if (completeTimer !== undefined) {
        clearTimeout(completeTimer);
        pendingCompletes.current.delete(todo.id);
      }

      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(todo.id);
        return next;
      });

      const timer = scheduleUndoToast({
        message: "Task deleted",
        onCommit: async () => {
          pendingDeletes.current.delete(todo.id);
          try {
            await todoApi.delete(todo.id);
          } catch {
            setTodos((prev) => {
              if (prev.some((t) => t.id === todo.id)) return prev;
              return [todo, ...prev];
            });
            toast.error("Failed to delete task");
          }
        },
        onUndo: () => {
          pendingDeletes.current.delete(todo.id);
          setTodos((prev) => {
            if (prev.some((t) => t.id === todo.id)) return prev;
            return [todo, ...prev].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
          });
        },
      });

      pendingDeletes.current.set(todo.id, { todo, timer });
    },
    [pendingDeletes, pendingCompletes, setTodos, setSelectedIds],
  );

  const bulkComplete = useCallback(async (): Promise<void> => {
    const ids = [...selectedIds].filter((id) => {
      const todo = todos.find((t) => t.id === id);
      return todo && !todo.completed;
    });
    if (ids.length === 0) return;

    setSelectedIds(new Set());
    await Promise.allSettled(ids.map((id) => todoApi.update(id, true)));
    setTodos((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, completed: true } : t)));

    ids.forEach((id) => {
      const timer = setTimeout(async () => {
        pendingCompletes.current.delete(id);
        try {
          await todoApi.delete(id);
        } catch {}
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }, UNDO_DELAY_MS);
      pendingCompletes.current.set(id, timer);
    });

    showUndoToast({
      message: `${ids.length} task${ids.length > 1 ? "s" : ""} marked as done`,
      undoLabel: "Undo all",
      onUndo: async () => {
        ids.forEach((id) => {
          clearTimeout(pendingCompletes.current.get(id));
          pendingCompletes.current.delete(id);
        });
        await Promise.allSettled(ids.map((id) => todoApi.update(id, false)));
        setTodos((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, completed: false } : t)));
      },
    });
  }, [selectedIds, todos, pendingCompletes, setTodos, setSelectedIds]);

  return { createTodo, completeTodo, deleteTodo, bulkComplete };
}

export { useTodoActions };

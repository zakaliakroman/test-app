import { useState, useEffect, useRef } from "react";
import { useCategories } from "./hooks/use-categories.hook";
import { useTodoList } from "./hooks/use-todo-list.hook";
import { useTodoSelection } from "./hooks/use-todo-selection.hook";
import { useTodoActions } from "./hooks/use-todo-actions.hook";
import type { PendingEntry } from "./todo.types";


function useTodos() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const pendingDeletes = useRef<Map<number, PendingEntry>>(new Map());
  const pendingCompletes = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const { categories } = useCategories();

  const { todos, setTodos, isLoading, error } = useTodoList(
    selectedCategoryId,
    pendingDeletes,
  );

  const { selectedIds, setSelectedIds, allSelected, toggleSelect, toggleSelectAll } =
    useTodoSelection(todos);

  const { createTodo, completeTodo, deleteTodo, bulkComplete } = useTodoActions({
    todos,
    setTodos,
    selectedIds,
    setSelectedIds,
    pendingDeletes,
    pendingCompletes,
  });

  useEffect(() => {
    return () => {
      pendingDeletes.current.forEach(({ timer }) => clearTimeout(timer));
      pendingCompletes.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return {
    todos,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    isLoading,
    error,
    selectedIds,
    allSelected,
    createTodo,
    completeTodo,
    deleteTodo,
    bulkComplete,
    toggleSelect,
    toggleSelectAll,
  };
}

export { useTodos };

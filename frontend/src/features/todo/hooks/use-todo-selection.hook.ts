import { useState, useCallback } from "react";
import type { Todo } from "@/types";


function useTodoSelection(todos: Todo[]) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const activeTodos = todos.filter((t) => !t.completed);
  const allSelected =
    activeTodos.length > 0 && activeTodos.every((t) => selectedIds.has(t.id));

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const active = todos.filter((t) => !t.completed);
    const isAllSelected =
      active.length > 0 && active.every((t) => selectedIds.has(t.id));
    setSelectedIds(isAllSelected ? new Set() : new Set(active.map((t) => t.id)));
  }, [todos, selectedIds]);

  return { selectedIds, setSelectedIds, allSelected, toggleSelect, toggleSelectAll };
}

export { useTodoSelection };

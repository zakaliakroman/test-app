import { CheckCheck, ClipboardList } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTodoContext } from "./todo.context";
import { TodoItem } from "./todo-item.component";

export const TodoList = () => {
  const {
    todos,
    isLoading,
    error,
    selectedIds,
    allSelected,
    bulkComplete,
    toggleSelectAll,
  } = useTodoContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-14 text-gray-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
        <span className="text-sm">Loading tasks…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-400">
        <ClipboardList className="h-10 w-10 opacity-30" />
        <p className="font-medium">No tasks here</p>
        <p className="text-xs">Add one above to get started.</p>
      </div>
    );
  }

  const activeTodos = todos.filter((t) => !t.completed);
  const hasSelection = selectedIds.size > 0;

  return (
    <div>
      {activeTodos.length > 0 && (
        <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-3">
          <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-gray-500">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary"
              aria-label="Select all active tasks"
            />
            {allSelected
              ? "Deselect all"
              : `Select all (${activeTodos.length})`}
          </label>

          {hasSelection && (
            <button
              type="button"
              onClick={bulkComplete}
              className={cn(
                "flex items-center gap-1.5 rounded-lg bg-success px-3 py-1.5",
                "text-xs font-semibold text-white shadow-sm transition-colors hover:opacity-90",
              )}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Complete selected ({selectedIds.size})
            </button>
          )}
        </div>
      )}

      <ul className="divide-y divide-gray-50">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
};

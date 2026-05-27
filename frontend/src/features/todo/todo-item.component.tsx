import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useTodoContext } from "./todo.context";
import type { Todo } from "@/types";

const BADGE_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
];

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const { selectedIds, completeTodo, deleteTodo, toggleSelect } = useTodoContext();

  const isSelected = selectedIds.has(todo.id);
  const badgeColor = BADGE_PALETTE[todo.categoryId % BADGE_PALETTE.length];
  const statusText = todo.completed ? "Completed" : "Pending";
  const completeMarker = todo.completed ? <Check className="h-3 w-3" strokeWidth={3} /> : null;

  const handleToggleSelect = () => toggleSelect(todo.id);
  const handleComplete = () => completeTodo(todo.id);
  const handleDelete = () => deleteTodo(todo);

  return (
    <li className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50">
      <div className="flex h-4 w-4 shrink-0 items-center justify-center">
        {!todo.completed ? (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleToggleSelect}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-primary"
            aria-label={`Select "${todo.text}"`}
          />
        ) : (
          <span />
        )}
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={todo.completed}

        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          "transition-all duration-200",
          {
            "border-success bg-success text-white": todo.completed,
            "border-primary/50 hover:border-success/50 bg-primary hover:bg-success/50": !todo.completed,
          },
        )}
        aria-label={`Mark "${todo.text}" as ${statusText}`}
        title={statusText}
      >
        {completeMarker}
      </button>

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm text-gray-800",
          {"text-gray-400 line-through": todo.completed}
        )}
      >
        {todo.text}
      </span>

      <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", badgeColor)}>
        {todo.category.name}
      </span>

      <button
        type="button"
        onClick={handleDelete}
        className="shrink-0 rounded-md p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
        aria-label={`Delete "${todo.text}"`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </li>
  );
};

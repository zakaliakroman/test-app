import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Loader2, Plus } from "lucide-react";
import { createTodoSchema, type CreateTodoFormValues } from "./todo.schema";
import { useTodoContext } from "./todo.context";
import { cn } from "@/lib/cn";

export const CreateTodo = () => {
  const { categories, createTodo } = useTodoContext();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { text: "", categoryId: 0 },
  });

  const handleFormSubmit = async (data: CreateTodoFormValues) => {
    try {
      await createTodo({ text: data.text, categoryId: data.categoryId });
      reset();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        setError("categoryId", { message: err.response.data.message });
      } else {
        setError("root", {
          message: "Failed to create task. Please try again.",
        });
      }
    }
  };

  const submitIcon = isSubmitting ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <Plus className="h-4 w-4" />
  );

  const inputBase =
    "w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none " +
    "placeholder:text-gray-400 transition-colors " +
    "focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="flex gap-2 items-stretch">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <input
            {...register("text")}
            placeholder="What needs to be done?"
            className={cn(inputBase, "border-gray-200", {
              "border-red-400": errors.text,
            })}
          />
          {errors.text && (
            <p className="text-xs text-red-500">{errors.text.message}</p>
          )}
        </div>

        <div className="flex w-44 shrink-0 flex-col gap-1">
          <select
            {...register("categoryId", { valueAsNumber: true })}
            className={cn(inputBase, "cursor-pointer border-gray-200", {
              "border-red-400": errors.categoryId,
            })}
          >
            <option value={0}>Category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "flex self-start items-center gap-1.5 rounded-lg bg-primary px-4 py-2",
            "text-sm font-semibold text-primary-foreground shadow-sm",
            "transition-colors hover:bg-primary-hover",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {submitIcon}
          Add
        </button>
      </div>

      {errors.root && (
        <p className="mt-2 text-xs text-red-500">{errors.root.message}</p>
      )}
    </form>
  );
};

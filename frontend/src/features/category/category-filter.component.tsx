import { useTodoContext } from "@/features/todo/todo.context";
import { cn } from "@/lib/cn";

const pillBase =
  "rounded-full px-3.5 py-1 text-sm font-medium transition-colors cursor-pointer";

export const CategoryFilter = () => {
  const { categories, selectedCategoryId, setSelectedCategoryId } = useTodoContext();

  const handleSelectAll = () => setSelectedCategoryId(null);
  const buildCategoryHandler = (id: number) => () => setSelectedCategoryId(id);

  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
        Filter
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className={cn(
            pillBase,
            {
              "bg-primary text-primary-foreground": selectedCategoryId === null,
              "bg-gray-100 text-gray-600 hover:bg-gray-200": selectedCategoryId !== null,
            },
          )}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={buildCategoryHandler(category.id)}
            className={cn(
              pillBase,
              {
                "bg-primary text-primary-foreground": selectedCategoryId === category.id,
                "bg-gray-100 text-gray-600 hover:bg-gray-200": selectedCategoryId !== category.id,
              },
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

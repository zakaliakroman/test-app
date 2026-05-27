import { Toaster } from "sonner";
import { Layout } from "@/components/layout.component";
import { TodoProvider } from "@/features/todo/todo.context";
import { CreateTodo } from "@/features/todo/create-todo.component";
import { CategoryFilter } from "@/features/category/category-filter.component";
import { TodoList } from "@/features/todo/todo-list.component";

/**
 * App is a pure layout shell — all state lives in TodoProvider.
 * Components pull what they need via useTodoContext(); no prop drilling.
 */
export default function App() {
  return (
    <TodoProvider>
      <Toaster position="bottom-right" richColors closeButton />

      <Layout>
        {/* ── Create new task ── */}
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            New task
          </p>
          <CreateTodo />
        </section>

        {/* ── Filter + list ── */}
        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <CategoryFilter />
          <TodoList />
        </section>
      </Layout>
    </TodoProvider>
  );
}

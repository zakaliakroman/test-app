import { createContext, useContext, type ReactNode } from "react";
import { useTodos } from "./todo.hook";

type TodoContextValue = ReturnType<typeof useTodos>;

const TodoContext = createContext<TodoContextValue | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const value = useTodos();
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodoContext = (): TodoContextValue => {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodoContext must be used inside <TodoProvider>");
  }
  return ctx;
};

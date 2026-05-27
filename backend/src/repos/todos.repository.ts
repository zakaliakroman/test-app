import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../db.js";
import { failure, Result, success } from "../utils/result.utils.js";

const WITH_CATEGORY = { include: { category: true } } as const;

export type TodoWithCategory = Prisma.TodoGetPayload<typeof WITH_CATEGORY>;

export const fetchTodos = async (
  where?: Prisma.TodoWhereInput,
): Promise<Result<TodoWithCategory[], Error>> => {
  try {
    const todos = await prisma.todo.findMany({
      where,
      ...WITH_CATEGORY,
      orderBy: { createdAt: "desc" },
    });
    return success(todos);
  } catch (error) {
    return failure(error as Error);
  }
};

export const countTodosByCategory = async (
  categoryId: number,
): Promise<Result<number, Error>> => {
  try {
    const count = await prisma.todo.count({ where: { categoryId } });
    return success(count);
  } catch (error) {
    return failure(error as Error);
  }
};

export const insertTodo = async (
  text: string,
  categoryId: number,
): Promise<Result<TodoWithCategory, Error>> => {
  try {
    const todo = await prisma.todo.create({
      data: { text: text.trim(), categoryId },
      ...WITH_CATEGORY,
    });
    return success(todo);
  } catch (error) {
    return failure(error as Error);
  }
};

export const patchTodo = async (
  id: number,
  completed: boolean,
): Promise<Result<TodoWithCategory, Error>> => {
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { completed },
      ...WITH_CATEGORY,
    });
    return success(todo);
  } catch (error) {
    return failure(error as Error);
  }
};

export const removeTodo = async (
  id: number,
): Promise<Result<undefined, Error>> => {
  try {
    await prisma.todo.delete({ where: { id } });
    return success(undefined);
  } catch (error) {
    return failure(error as Error);
  }
};

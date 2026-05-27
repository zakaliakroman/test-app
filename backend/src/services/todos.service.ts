import {
  fetchTodos,
  countTodosByCategory,
  insertTodo,
  patchTodo,
  removeTodo,
  type TodoWithCategory,
} from "../repositories/todos.repository.js";
import { failure, Result, success } from "../utils/result.utils.js";
import type { ServiceError } from "../types/service-error.type.js";
import { HttpStatus } from "../types/enums/http-status.enum.js";

const MAX_TASKS_PER_CATEGORY = 5;

const isNotFound = (error: Error): boolean =>
  (error as { code?: string }).code === "P2025";

// Using HTTP status code is not a best practice in service layer
// but for simplicity we are using it here
export const getTodos = async (
  categoryId?: number,
): Promise<Result<TodoWithCategory[], ServiceError>> => {
  const result = await fetchTodos(categoryId ? { categoryId } : undefined);
  if (!result.success) {
    console.error("Error fetching todos:", result.error);
    return failure({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch todos",
    });
  }
  return success(result.data);
};

export const createTodo = async (
  text: string,
  categoryId: number,
): Promise<Result<TodoWithCategory, ServiceError>> => {
  const countResult = await countTodosByCategory(categoryId);

  if (!countResult.success) {
    console.error("Error counting todos:", countResult.error);
    return failure({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create todo",
    });
  }

  if (countResult.data >= MAX_TASKS_PER_CATEGORY) {
    console.error(
      `Category ${categoryId} has reached the maximum number of tasks.`,
    );
    return failure({
      code: HttpStatus.BAD_REQUEST,
      message: `This category already has ${MAX_TASKS_PER_CATEGORY} tasks. Please delete or complete existing tasks first.`,
    });
  }

  const result = await insertTodo(text, categoryId);
  if (!result.success) {
    console.error("Error creating todo:", result.error);
    return failure({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create todo",
    });
  }
  return success(result.data);
};

export const updateTodo = async (
  id: number,
  completed: boolean,
): Promise<Result<TodoWithCategory, ServiceError>> => {
  const result = await patchTodo(id, completed);

  if (!result.success) {
    console.error("Error updating todo:", result.error);
    const errorObject = isNotFound(result.error)
      ? { code: HttpStatus.NOT_FOUND, message: `Todo ${id} not found` }
      : {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to update todo",
        };

    return failure(errorObject);
  }

  return success(result.data);
};

export const deleteTodo = async (
  id: number,
): Promise<Result<undefined, ServiceError>> => {
  const result = await removeTodo(id);
  if (!result.success) {
    console.error("Error deleting todo:", result.error);
    const errorObject = isNotFound(result.error)
      ? { code: HttpStatus.NOT_FOUND, message: `Todo ${id} not found` }
      : {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Failed to delete todo",
        };

    return failure(errorObject);
  }
  return success(undefined);
};

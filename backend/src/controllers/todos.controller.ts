import type { Request, Response } from "express";
import { match } from "../utils/result.utils.js";
import { parseBody, parseParams, parseQuery } from "../utils/validate.utils.js";
import { HttpStatus } from "../types/enums/http-status.enum.js";
import {
  createTodoSchema,
  getTodosQuerySchema,
  todoIdParamSchema,
  updateTodoSchema,
} from "../schemas/todos.schema.js";
import * as todosService from "../services/todos.service.js";

export const getTodos = async (req: Request, res: Response) => {
  const query = parseQuery(getTodosQuerySchema, req, res);
  if (!query) return;

  const result = await todosService.getTodos(query.category);

  match(
    result,
    (todos) => res.status(HttpStatus.OK).json(todos),
    (error) => res.status(error.code).json({ message: error.message }),
  );
};

export const createTodo = async (req: Request, res: Response) => {
  const body = parseBody(createTodoSchema, req, res);
  if (!body) return;

  const result = await todosService.createTodo(body.text, body.categoryId);

  match(
    result,
    (todo) => res.status(HttpStatus.CREATED).json(todo),
    (error) => res.status(error.code).json({ message: error.message }),
  );
};

export const updateTodo = async (req: Request, res: Response) => {
  const params = parseParams(todoIdParamSchema, req, res);
  if (!params) return;

  const body = parseBody(updateTodoSchema, req, res);
  if (!body) return;

  const result = await todosService.updateTodo(params.id, body.completed);

  match(
    result,
    (todo) => res.status(HttpStatus.OK).json(todo),
    (error) => res.status(error.code).json({ message: error.message }),
  );
};

export const deleteTodo = async (req: Request, res: Response) => {
  const params = parseParams(todoIdParamSchema, req, res);
  if (!params) return;

  const result = await todosService.deleteTodo(params.id);

  match(
    result,
    () => res.status(HttpStatus.NO_CONTENT).send(),
    (error) => res.status(error.code).json({ message: error.message }),
  );
};

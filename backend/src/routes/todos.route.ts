import { Router } from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todos.controller.js";

export const todosRouter = Router();

todosRouter.get("/", getTodos);
todosRouter.post("/", createTodo);
todosRouter.patch("/:id", updateTodo);
todosRouter.delete("/:id", deleteTodo);

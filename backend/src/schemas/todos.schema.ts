import { z } from "zod";


export const createTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Task text is required")
    .max(200, "Task text must be 200 characters or less"),
  categoryId: z.number().int().positive("Category is required"),
});


export const updateTodoSchema = z.object({
  completed: z.boolean(),
});


export const todoIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid todo ID"),
});

export const getTodosQuerySchema = z.object({
  category: z.coerce.number().int().positive().optional(),
});

import { z } from "zod";

export const createTodoSchema = z.object({
  text: z
    .string()
    .min(1, "Task text is required")
    .max(200, "Task text must be 200 characters or less"),
  categoryId: z
    .number()
    .refine((n) => !isNaN(n) && n > 0, { message: "Please select a category" }),
});

export type CreateTodoFormValues = z.infer<typeof createTodoSchema>;

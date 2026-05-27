import type { Request, Response } from "express";
import { z } from "zod";
import { HttpStatus } from "../types/enums/http-status.enum.js";

const sendValidationError = (res: Response, error: z.ZodError): void => {
  res.status(HttpStatus.BAD_REQUEST).json({
    message: error.issues[0]?.message ?? "Validation failed",
    errors: error.issues,
  });
};

export const parseBody = <T extends z.ZodTypeAny>(
  schema: T,
  req: Request,
  res: Response,
): z.infer<T> | null => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    sendValidationError(res, result.error);
    return null;
  }
  return result.data;
};

export const parseParams = <T extends z.ZodTypeAny>(
  schema: T,
  req: Request,
  res: Response,
): z.infer<T> | null => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    sendValidationError(res, result.error);
    return null;
  }
  return result.data;
};

export const parseQuery = <T extends z.ZodTypeAny>(
  schema: T,
  req: Request,
  res: Response,
): z.infer<T> | null => {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    sendValidationError(res, result.error);
    return null;
  }
  return result.data;
};

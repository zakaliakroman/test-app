import type { Request, Response } from "express";
import { match } from "../utils/result.utils.js";
import { HttpStatus } from "../types/enums/http-status.enum.js";
import * as categoriesService from "../services/categories.service.js";

export const getCategories = async (_req: Request, res: Response) => {
  const result = await categoriesService.getCategories();

  match(
    result,
    (categories) => res.status(HttpStatus.OK).json(categories),
    (error) => res.status(error.code).json({ message: error.message }),
  );
};

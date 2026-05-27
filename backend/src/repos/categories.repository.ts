import { Category } from "../../generated/prisma/client.js";
import { prisma } from "../db.js";
import { failure, Result, success } from "../utils/result.utils.js";

export const fetchCategories = async (): Promise<Result<Category[], Error>> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return success(categories);
  } catch (error) {
    return failure(error as Error);
  }
};

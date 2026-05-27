import { Category } from "../../generated/prisma/client.js";
import { fetchCategories } from "../repositories/categories.repository.js";
import { failure, Result, success } from "../utils/result.utils.js";
import type { ServiceError } from "../types/service-error.type.js";
import { HttpStatus } from "../types/enums/http-status.enum.js";

// Using HTTP status code is not a best practice in service layer
// but for simplicity we are using it here
export const getCategories = async (): Promise<
  Result<Category[], ServiceError>
> => {
  const result = await fetchCategories();

  if (!result.success) {
    console.error("Error fetching categories:", result.error);

    return failure({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch categories",
    });
  }
  return success(result.data);
};

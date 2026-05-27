import type { Category } from "@/types";
import { apiClient } from "../api-client";

export const categoryApi = {
  getAll: (signal?: AbortSignal): Promise<Category[]> =>
    apiClient.get<Category[]>("/categories", { signal }).then((r) => r.data),
};

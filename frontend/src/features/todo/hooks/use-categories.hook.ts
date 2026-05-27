import { useState, useEffect } from "react";
import { isCancel } from "axios";
import { toast } from "sonner";
import type { Category } from "@/types";
import { categoryApi } from "@/lib/api/category/category-api";


function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    categoryApi
      .getAll(controller.signal)
      .then(setCategories)
      .catch((err) => {
        if (isCancel(err)) return;
        toast.error("Failed to load categories");
      });

    return () => controller.abort();
  }, []);

  return { categories };
}

export { useCategories };

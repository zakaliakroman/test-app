import type { Todo } from "@/types";

export type PendingEntry = {
  todo: Todo;
  timer: ReturnType<typeof setTimeout>;
};

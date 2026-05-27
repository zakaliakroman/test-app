import { toast } from "sonner";

export const UNDO_DELAY_MS = 5_000;

export type UndoToastOptions = {
  message: string;
  undoLabel?: string;
  onUndo: () => void | Promise<void>;
};

export type ScheduleUndoOptions = UndoToastOptions & {
  onCommit: () => Promise<void>;
};


export const showUndoToast = ({
  message,
  undoLabel = "Undo",
  onUndo,
}: UndoToastOptions): void => {
  toast(message, {
    duration: UNDO_DELAY_MS,
    action: {
      label: undoLabel,
      onClick: () => void onUndo(),
    },
  });
};


export const scheduleUndoToast = ({
  onCommit,
  onUndo,
  ...toastOptions
}: ScheduleUndoOptions): ReturnType<typeof setTimeout> => {
  const timer = setTimeout(() => void onCommit(), UNDO_DELAY_MS);

  showUndoToast({
    ...toastOptions,
    onUndo: () => {
      clearTimeout(timer);
      return onUndo();
    },
  });

  return timer;
};

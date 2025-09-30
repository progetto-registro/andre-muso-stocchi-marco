import { createContext } from "react";

// spezziamo i due context: uno peer gli state così unico a cambiare e l alltro , utilizzato da tutti i comp tranne rotella, non va a re-renderare in continuazione

export type LoadingState = { isOpen: boolean; message: string };

export type LoadingActions = {
  show: (msg?: string) => void;
  hide: () => void;
  setMessage: (msg?: string) => void;
  runWithLoading: <T>(
    task: () => Promise<T>,
    msg?: string,
    ms?: number,
    wait?: boolean
  ) => Promise<T>;
};

export const LoadingStateContext = createContext<LoadingState | null>(null);
export const LoadingActionsContext = createContext<LoadingActions | null>(null);

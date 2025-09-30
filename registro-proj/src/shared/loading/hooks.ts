import { useContext } from "react";
import { LoadingStateContext, LoadingActionsContext } from "./contexts";

export function useLoading() {
  const ctx = useContext(LoadingActionsContext);
  if (!ctx) throw new Error("useLoading va usato sotto <LoadingSystem>.");
  return ctx;
}

export function useLoadingState() {
  const ctx = useContext(LoadingStateContext);
  if (!ctx) throw new Error("useLoadingState va usato sotto <LoadingSystem>.");
  return ctx;
}

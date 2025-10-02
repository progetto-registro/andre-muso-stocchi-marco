import { useCallback, useContext } from "react";
import { LoadingStateContext, LoadingActionsContext } from "./contexts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

//NON USATA
export function useHideRotellaVECCHIO() {
  const { hide } = useLoading();
  useEffect(() => {
    const id = setTimeout(hide, 0); // (si dovrebbe usare una cosa apposta, requestAnimationFrame(hide) e via) ... comunque timeout 0 trucco per aspettare il primo paint perchè (non so perchè) lo aspetta per eseguirsi di fatto..comunque setTimeout come onChange, vuole def della funzione che lui avviuerà, non l esecuzione hide(); se hai param fai ()=>hide(..,..)
    return () => clearTimeout(id); //clean up : se il comp si smonta prima che scatti timer, non fai hide a caso (perchè non c'è piu il timer che la esegua)
  }, [hide]);
}

// piu carino
export function useHideRotella(triggers: ReadonlyArray<unknown> = []) {
  const { hide } = useLoading();

  useEffect(() => {
    //timeout e clear da togliere ma avevo paura fosse troppo velcoe
    const idT = setTimeout(hide, 500);
    const idRaf = requestAnimationFrame(() => hide()); // ciò che fa è chiaro.  lo fa " al prossimo frame", quindi almeno al primo penso sia questa l idea, in generale piu morbido di timeout ( che lo fa al prossimo macrotask, qualsiasi cosa sia un macrotask, avviene piu spesso ( immagino sia la prossima cosa in lista nell elenco di cose .. lo stesso elenco in cui se returna una promise diventa prima in lista))

    return () => {
      cancelAnimationFrame(idRaf);
      clearTimeout(idT);
    };
  }, [hide, ...triggers]); //così gli passiamoa nche le mode in classrom etc
}

//🤔⚠️❓❔ PERCHE' NON VA BENE❓❔
/*
export function useNavigateWithRotella(path: string, message?: string) {
  const navigate  = useNavigate();
  const { show, setMessage } = useLoading();

  setMessage(message ?? "Caricamento..");
  show();
  navigate(path);
}

*/
// 1 Se metti questo hook a function scope viene eseguito prima che il render sia finito, e questo hook tocca lo state e fa navigate: non esiste che fai side-effect during render
// 2 Se pensavi di usare questo hook non a function scope come fosse una funzione util, non funziona così: gli hook solo a function scope li puoi usare, tutti, e quindi TUTTI  si avviano prerender e fanno ciò che devono. Se ti serve funzione, fai custom hook che te la ritorna (come fanno molti hook normali, non tuoi)
// 3 la useHideRotella qui sopra invece va bene che venga eseguita a top level during render: è una useEffect

export type NavigateWithRotellaOptions = {
  message?: string;
  replace?: boolean;
  state?: any;
};

export function useNavigateWithRotella() {
  const navigate = useNavigate();
  const { show, setMessage } = useLoading();

  // così useNavigate non ce ne da una nuova ogni volta e visto che la usano tutti causerebbe rerender a tutti
  return useCallback(
    (path: string, opts?: NavigateWithRotellaOptions) => {
      const message = opts?.message ?? "Caricamento...";
      setMessage(message);
      show();

      navigate(path, {
        replace: opts?.replace,
        state: {
          ...opts?.state,
          message: message,
        },
      });
    },
    [navigate, show, setMessage]
  );
}

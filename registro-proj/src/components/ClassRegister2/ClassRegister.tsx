import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { orderBy } from "lodash";
import { Alert, Box, Container } from "@mui/material";

import TableRegister from "./TableRegister";
import type { ClassRegisterMode } from "../../models/ClassRegisterMode";
import type { Lezione } from "../../models/Lezione";
import type { Studente } from "../../models/Studente";

// ────────────────────────────────────────────────────────────────────────────────
// Helper: messaggi da status
function mapErrorMessage(err: unknown): string {
  const e = err as AxiosError<any>;
  if (e.response) {
    const s = e.response.status;
    if (s === 400) return "Campi mancanti o mal formattati.";
    if (s === 401) return "Non autorizzato.";
    if (s === 404) return "Risorsa non trovata.";
    return "Errore del server. Riprova più tardi.";
  } else if (e.request) {
    return "Nessuna risposta dal server. Controlla la connessione.";
  }
  return "Errore applicativo imprevisto.";
}
// ────────────────────────────────────────────────────────────────────────────────

export default function ClassRegister() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dati principali
  const [lezioni, setLezioni] = useState<Lezione[]>([]);
  const [studenti, setStudenti] = useState<Studente[]>([]);
  const [reloadTag, setReloadTag] = useState<boolean>(false); //ogni volta che lo cambiamo riparte lo useEffect che fa la get degli studenti e delle lezioni.

  // Modalità corrente (lista / edit / new)
  const [mode, setMode] = useState<ClassRegisterMode>("view");

  // Se siamo in edit, quale lezione? (serve anche per “aprire”/focalizzare la riga)
  const [editingLessonId, setEditingLessonId] = useState<number | undefined>(
    undefined
  );

  // Focus della riga dopo un salvataggio/redirect alla lista
  const [focusLessonId, setFocusLessonId] = useState<number | undefined>(
    undefined
  );

  // UI
  const [loading, setLoading] = useState<boolean>(false); // sincronizzare con quella libreria che fa l animazione zustang qualcosa
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ───────────────────────────────────────────────────────────────────────────────
  // GET iniziale (lezioni + studenti)
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        // Lezioni
        const lezRes = await axios.get<Lezione[]>("/api/lezioni");
        setLezioni(lezRes.data ?? []);

        // Studenti (se la tua API è diversa, cambia l’endpoint; se ancora non c’è, lascia try/catch)
        try {
          const studRes = await axios.get<Studente[]>("/api/studenti");
          setStudenti(studRes.data ?? []);
        } catch {
          // se non esiste ancora l’endpoint studenti, non blocchiamo nulla
          setStudenti([]);
        }
      } catch (err) {
        setErrorMessage(mapErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [reloadTag]);

  // ────────────────────────────────────────────────────────────────────────────────
  // Parsing del path → imposta mode e (se edit) l’id
  useEffect(() => {
    const path = location.pathname; // es. /class-register/123/edit | /class-register/new | /class-register
    // new
    if (path.endsWith("/new")) {
      setMode("new");
      setEditingLessonId(undefined);
      // se arrivi diretto in /new non c’è focus sulla lista (non siamo in lista)
      setFocusLessonId(undefined);
      return;
    }

    // edit
    const parts = path.split("/").filter(Boolean); // ["class-register","123","edit"]
    if (
      parts.length === 3 &&
      parts[0] === "class-register" &&
      parts[2] === "edit"
    ) {
      const id = Number(parts[1]);
      if (Number.isNaN(id)) {
        setMode("view");
        setEditingLessonId(undefined);
        navigate("/class-register", { replace: true });
        return;
      }
      setMode("edit");
      setEditingLessonId(id);
      // non tocchiamo focusLessonId qui; lo gestiamo al salvataggio per il ritorno in lista
      return;
    }

    // default: lista
    setMode("view");
    setEditingLessonId(undefined);

    // Se torniamo alla lista, possiamo raccogliere eventuale focus passato via navigate(state)
    const maybeFocus = (location.state as any)?.focusId as number | undefined;
    if (maybeFocus) setFocusLessonId(maybeFocus);
    // pulisci lo state di navigazione per non rifare focus ad ogni mount
    if (maybeFocus) {
      navigate("/class-register", { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  // ────────────────────────────────────────────────────────────────────────────────
  // Mappa studenti by CF ordinati (cognome, nome, cf)
  // 1) mappa ordinata string (cf) {nome, cognome} , in realtà record, che è solo un tipo non "struttura" come Map con sui metodi etc. Se chiave è string e non cambia tutto spessissimo va benissimo record
  const allStudentByCfSorted = useMemo<
    Record<string, { nome?: string; cognome?: string }>
  >(() => {
    const sorted = orderBy(
      // con sortedBy sempre lodash non puoi decidere asc desc, sempre asc; in ogni caso se non c'è funz ma solo prop puoi fare order/sortBy(nomeIterable, [prop1,prop2, ..] ?, [asc, desc,..])
      studenti ?? [],
      [
        (s: Studente) => s.cognome?.toLowerCase() ?? "",
        (s: Studente) => s.nome?.toLowerCase() ?? "",
        (s: Studente) => s.cf,
      ],
      ["asc", "asc", "asc"]
    );
    return sorted.reduce((acc, s) => {
      acc[s.cf] = { nome: s.nome, cognome: s.cognome };
      return acc;
    }, {} as Record<string, { nome?: string; cognome?: string }>); //  l init usato per tipizzare fiero
  }, [studenti]); // ok lo fa quando cambia studenti, ma non rerendera subito dopo

  // ────────────────────────────────────────────────────────────────────────────────
  // Handlers “di pagina”: navigazione tra mode
  const onCreate = () => {
    navigate("/class-register/new");
  };

  const onEdit = (lezione: Lezione) => {
    // portiamo i dati con navigate(state) per UI reattiva; fallback già gestito dal parsing del path
    navigate(`/class-register/${lezione.id}/edit`, { state: { lezione } });
  };

  const onCancelEdit = () => {
    // torni alla lista senza cambiare cache
    navigate("/class-register");
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // Salvataggi (new / edit) – payload: { id?; dataLezione; studenti }
  const onSaveLesson = async (payload: {
    id?: number;
    dataLezione: string;
    studenti: { cf: string; ore: number }[];
  }) => {
    setErrorMessage(null);

    try {
      if (payload.id != null) {
        // EDIT → POST /api/lezioni/modifica
        await axios.post("/api/lezioni/modifica", {
          id: payload.id,
          dataLezione: payload.dataLezione,
          studenti: payload.studenti,
        });

        // Aggiorna cache locale (sostituzione)
        setLezioni((prev) => {
          const i = prev.findIndex((l) => l.id === payload.id);
          if (i < 0) return prev;
          const updated = {
            ...prev[i],
            dataLezione: payload.dataLezione,
            studenti: payload.studenti,
          };
          const copy = [...prev];
          copy[i] = updated;
          return copy;
        });

        // Rientra in lista e focalizza quella riga
        setFocusLessonId(payload.id);
        navigate("/class-register", { state: { focusId: payload.id } });
      } else {
        // NEW → PUT /api/lezioni/nuova
        // NB: il BE (poco ortodosso) restituisce 200; se ti ritorna la lezione creata, usa quella; se no, rifai GET
        const res = await axios.put<Lezione | undefined>("/api/lezioni/nuova", {
          dataLezione: payload.dataLezione,
          studenti: payload.studenti,
        });

        if (res.data && res.data.id != null) {
          const created = res.data;
          setLezioni((prev) => [...prev, created]);
          setFocusLessonId(created.id);
          navigate("/class-register", { state: { focusId: created.id } });
        } else {
          // se non torna l’oggetto, fai un refetch "soft"
          const lezRes = await axios.get<Lezione[]>("/api/lezioni");
          setLezioni(lezRes.data ?? []);
          // prova a dedurre l’ultima (se il BE inserisce in coda) – fallback: niente focus
          const last = lezRes.data?.at(-1);
          if (last?.id != null) {
            setFocusLessonId(last.id);
            navigate("/class-register", { state: { focusId: last.id } });
          } else {
            navigate("/class-register");
          }
        }
      }
    } catch (err) {
      setErrorMessage(mapErrorMessage(err));
      // restiamo nella pagina corrente (edit/new) così l’utente vede l’errore e può correggere
    }
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // Delete lezione
  const onDeleteLesson = async (id: number) => {
    setErrorMessage(null);
    try {
      await axios.delete("/api/lezione/elimina", { data: { id } }); // body nel delete
      setLezioni((prev) => prev.filter((l) => l.id !== id));

      // Se eri in edit di quella lezione → torna alla lista
      if (mode === "edit" && editingLessonId === id) {
        navigate("/class-register");
      }
    } catch (err) {
      setErrorMessage(mapErrorMessage(err));
    }
  };

  // ────────────────────────────────────────────────────────────────────────────────
  // Render
  // (layout estetico lasciato simile al tuo; sistemerai poi)
  return (
    <Box
      sx={{
        fontFamily: "Roboto",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        placeItems: "center",
        backgroundColor: "lightblue",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          fontFamily: "Roboto",
          height: "100vh",
          width: "100vw",
          display: "flex",
          placeItems: "center",
          backgroundColor: "lightblue",
          flexDirection: "column",
          overflow: "auto",
          py: 2,
        }}
      >
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* TODO: TableRegister deve supportare queste prop: 
             - mode ("view" | "edit" | "new")
             - lezioni (array)
             - editingLessonId (serve per marcare la row in edit + aprirla)
             - focusLessonId (serve per scrollIntoView/focus dopo salvataggio)
             - onCreate, onModify, onCancelEdit, onSave, onDeleteLesson
             - allStudentByCfToBeSorted (array Studente) oppure direttamente allStudentByCfSorted (record)
        */}
        <TableRegister
          mode={mode}
          lezioni={lezioni}
          editingLessonId={editingLessonId}
          focusLessonId={focusLessonId}
          onCreate={onCreate}
          onEdit={onEdit}
          onCancelEdit={onCancelEdit}
          onSave={onSaveLesson}
          onDeleteLesson={onDeleteLesson}
          // se preferisci passare il record già pronto, cambiale firma
          allStudentByCfSorted={allStudentByCfSorted}
          onReload={() => setReloadTag((p) => !p)}
        />
      </Container>
    </Box>
  );
}

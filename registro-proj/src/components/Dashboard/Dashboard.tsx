import { Alert, Box, Container } from "@mui/material";
import type { Studente } from "../../models/Studente";
import { useEffect, useState } from "react";
import { useLoading } from "../../shared/loading/hooks";
import axios from "axios";
import type { ClassRegisterMode } from "../../models/ClassRegisterMode";
import EditStudent from "./EditStudent";


import { navigateLandingPageIfNotAuth, popupAlert } from "../../shared/staticData";


import { useNavigate } from "react-router-dom";
import DashboardTable from "./DashboardTable";

export default function Dashboard() {

  const navigate = useNavigate();
  const { runWithLoading } = useLoading();

  const [studenti, setStudenti] = useState<Studente[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studenteInModifica, setStudenteInModifica] = useState<
    Studente | undefined
  >();

  //La classe ClassRegisterMode in realtà va bene anche qui visto che ha gli stessi stati
  const [mode, setMode] = useState<ClassRegisterMode>("view");
  // "/api/studenti"
  useEffect(() => {
  let cancelled = false;

  void runWithLoading(async () => {
    setErrorMessage(null);
    try {
      const res = await axios.get<Studente[]>("/api/studenti");
      if (cancelled) return;
      setStudenti(res.data ?? []);
      setRefetch(false);
    } catch (error: any) {
      if (cancelled) return;
      setRefetch(false);
      setErrorMessage("");
      if (error.response) {
        const s = error.response.status;
        if (s === 401) {
          setErrorMessage("Non autorizzato.");
          navigateLandingPageIfNotAuth(error, navigate);
        } else if (s === 404) {
          setErrorMessage("API non trovata.");
        } else {
          setErrorMessage("Errore del server. Riprova più tardi.");
        }
      } else if (error.request) {
        setErrorMessage("Nessuna risposta dal server. Controlla la connessione.");
      } else {
        setErrorMessage("Errore applicativo imprevisto.");
      }
    }
  }, "Carico studenti…");

  return () => { cancelled = true; };
}, [refetch, runWithLoading, navigate]);

    useEffect(() => {
      if (errorMessage) {
        
        popupAlert(errorMessage,"rosso");
      }
    }, [errorMessage]);

  const onCreate = () => {
    setErrorMessage("");
    setStudenteInModifica(undefined);
    setMode("edit");
  };
  const onModify = (studente: Studente) => {
    setErrorMessage("");
    setStudenteInModifica(studente);
    setMode("edit");
  };
  //
  const onDelete = async (studente: Studente) => {
  setErrorMessage("");
  try {
    await runWithLoading(async () => {
      await axios.delete("/api/studenti/elimina", { data: { cf: studente.cf } });
      setStudenti(prev => prev.filter(s => s.cf !== studente.cf));
      setMode("view");
    }, "Elimino studente…");
  } catch (error) {
    console.error(error);
    setErrorMessage("Impossibile eliminare lo studente.");
  }
};
/////////////// ARRIVATO QUI !!!!!!!!!!!! !!!!!!!!!!! !!!!!!!!!!! 
  const onSaved = async (studente: Studente) => {
    setErrorMessage("");

    const nuovoStudente: Studente = {
      ...studente,
      cf: studente.cf.toUpperCase(),
      sesso: studente.sesso.toUpperCase() as "M" | "F",
      dataNascita: studente.dataNascita,
    };

    try {
      if (studenteInModifica) {
        //Quando dev'essere modificato fa questo
        await axios.post("/api/studenti/modifica", nuovoStudente);
        setRefetch(true);
        setStudenti((precedente) =>
          precedente.map((s) =>
            s.cf.toUpperCase() === nuovoStudente.cf ? nuovoStudente : s
          )
        );
      } else {
        //Quando invece è nuovo fa questo
        await axios.put("/api/studenti/nuovo", nuovoStudente);
        setRefetch(true);
        setStudenti((prev) => [...prev, nuovoStudente]);
      }

      setMode("view");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data ?? "Errore nel salvataggio dello studente."
      );
    }
  };

  const onCancel = () => {
    setErrorMessage("");
    setMode("view");
    setStudenteInModifica(undefined);
  };

  return (
    <>
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
            py: 10,
          }}
        >
         
          {mode !== "view" ? (
            <EditStudent
              studenteInModifica={studenteInModifica}
              onSaved={onSaved}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          ) : (
            <DashboardTable
              studenti={studenti}
              onCreate={onCreate}
              onModify={onModify}
              onReload={() => {
                setRefetch(true);
              }}
              onDelete={onDelete}
            />
          )}
        </Container>
      </Box>
    </>
  );
}

import { Alert, Box, Container } from "@mui/material";
import type { Studente } from "../../models/Studente";
import { useEffect, useState } from "react";
import { useLoading } from "../../shared/loading/hooks";
import axios, { AxiosError } from "axios";
import type { ClassRegisterMode } from "../../models/ClassRegisterMode";
import EditStudent from "./EditStudent";

import { navigateLandingPageIfNotAuth, popupAlert } from "../../shared/utils";

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
    let cancelled = false; // se cancelled è true vuol dire che questo era il secondo useEffect di una raffica di click su refetch. quando ha iniziato ha messo a false il cancelled, che a riposo sta a true, ma se lo ritrova a true dopo un await (=> un altro useeffect l ha messo a true perchè nel frattempo ha finito)

    void runWithLoading(
      async () => {
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
            setErrorMessage(
              "Nessuna risposta dal server. Controlla la connessione."
            );
          } else {
            setErrorMessage("Errore applicativo imprevisto.");
          }
        }
      },
      "Carico studenti…",
      700,
      true
    );

    return () => {
      cancelled = true; // alla fine lo mettiamo a true, appunto
    };
  }, [refetch, runWithLoading, navigate]);

  // tolto errorMessage nelle textbox : ora serve solo a dare messaggio a toast ( che è dentro popupAllert)
  
  useEffect(() => {
    if (errorMessage) {
      popupAlert(errorMessage, "rosso");
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
        await axios.delete("/api/studenti/elimina", {
          data: { cf: studente.cf },
        });
        setStudenti((prev) => prev.filter((s) => s.cf !== studente.cf));
        setMode("view");
        popupAlert("Rimozione avvenuta con successo!","verde");
      }, "Elimino studente…");
    } catch (error) {
      console.error(error);
      setErrorMessage("Impossibile eliminare lo studente.");
    }
  };

  // MODIFICA O NUOVO

  const onSaved = async (studente: Studente) => {
    setErrorMessage("");

    const nuovoStudente: Studente = {
      ...studente,
      cf: studente.cf.toUpperCase(),
      sesso: studente.sesso.toUpperCase() as "M" | "F",
      dataNascita: studente.dataNascita,
    };

    try {
      await runWithLoading(
        async () => {
          if (studenteInModifica) {
            await axios.post("/api/studenti/modifica", nuovoStudente); // volendo prendi la res e fai (res.data as any ).unCampoDelPayloadCheUsiTipoSuccess===false .. e poi in altri campi di res.data magari c'è info. e puoi fare throw new error e passar emessaggio contenuto dalla res o personalizzato, e poi error catchato dal catch esterno e setta errormessage => toast. ma noi non usiamo il 200 per gestire errori

            setRefetch(true); //🔴🟠inutile refetchare studenti tanto li aggiorni in locale con il nuovo/modificato, e BE già modificato con axios. rerender gratuito
            setStudenti((prev) =>
              prev.map((s) =>
                s.cf.toUpperCase() === nuovoStudente.cf ? nuovoStudente : s
              )
            );
          } else {
            const res = await axios.put<Studente | undefined>(
              "/api/studenti/nuovo",
              nuovoStudente
            );
                
            setRefetch(true); //🔴🟠 idem
            setStudenti((prev) => [...prev, res.data ?? nuovoStudente]);
          }
          popupAlert("Registro modificato!","verde");
          setMode("view");
        },
        studenteInModifica ? "Aggiorno studente…" : "Creo studente…" // secondo param di runWithLoading , per messaggio rotella
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // se err è AxiosError => true
        if (err.response) {
          // const s = err.response.status; // volendo comportamenti per stato ma non ci serve cuz be ci da stringa errore come corpo del body e noi la usiamo.

          setErrorMessage(
            err.response.data ?? "Errore applicativo imprevisto."
          ); //.data per il body della response , quello che in postman si chiama body
        } else if (err.request) {
          setErrorMessage("Timeout. Nessuna risposta dal server.");
        }
      } else {
        setErrorMessage("Errore applicativo imprevisto.");
      }
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

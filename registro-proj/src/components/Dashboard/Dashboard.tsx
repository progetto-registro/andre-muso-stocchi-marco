import { Alert, Box, Container } from "@mui/material";
import type { Studente } from "../../models/Studente";
import { useEffect, useState } from "react";
import axios from "axios";
import type { ClassRegisterMode } from "../../models/ClassRegisterMode";
import EditStudent from "./EditStudent";
import DashboardRegister from "./DashboardRegister";
import { navigateLandingPageIfNotAuth } from "../../shared/staticData";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [studenti, setStudenti] = useState<Studente[]>([]);
  const navigate = useNavigate();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studenteInModifica, setStudenteInModifica] = useState<
    Studente | undefined
  >();

  //La classe ClassRegisterMode in realtà va bene anche qui visto che ha gli stessi stati
  const [mode, setMode] = useState<ClassRegisterMode>("view");

  const apiLink =
    "https://68d7e3ba2144ea3f6da6bd33.mockapi.io/api/studenti/Studenti";
  //"http://localhost:8080/api/studenti";   basta usare /api/studenti . il primo pezzo è mappato su api nel viteconfig

  useEffect(() => {
    axios
      .get(apiLink)
      .then((res) => {
        console.log(res.data);
        setStudenti(res.data);
        setRefetch(false);
      })
      .catch((error) => {
        setRefetch(false);
        console.log(error);
        setErrorMessage("");
        if (error.response) {
          const s = error.response.status;
          if (s === 401) {
            setErrorMessage("Non autorizzato.");
             navigateLandingPageIfNotAuth(error,navigate);
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
      });
  }, [refetch]);

  const onCreate = () => {
    setStudenteInModifica(undefined);
    //navigate("/dashboard/new");
    setMode("edit");
  };
  const onModify = (studente: Studente) => {
    setStudenteInModifica(studente);
    //navigate(`/dashboard/${studente.cf}/edit`, { state: { studente } });
    setMode("edit");
  };

  const onDelete = async (studente: Studente) => {
    try {
      await axios.delete(apiLink + `/${studente.cf}`);
      setStudenti((prev) => prev.filter((s) => s.cf !== studente.cf));
    } catch (error) {
      console.error(error);
      setErrorMessage("Impossibile eliminare lo studente. Riprova più tardi.");
    }
    setMode("view");
  };

  const onSaved = async (saved: Studente) => {
    try {
      if (studenti.some((s) => s.cf === saved.cf)) {
        //se dev'essere modificato
        await axios.put(`${apiLink}/${saved.cf}`, saved);
        setStudenti((prev) => prev.map((s) => (s.cf === saved.cf ? saved : s)));
      } else {
        // se va aggiunto
        await axios.post(apiLink, saved);
        setStudenti((prev) => [...prev, saved]);
      }
      setMode("view");
    } catch (error) {
      console.error(error);
      setErrorMessage("Errore nel salvataggio dello studente.");
    }
  };

  const onCancel = () => {
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
          maxWidth="sm"
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
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {mode !== "view" ? (
            <EditStudent
              studenteInModifica={studenteInModifica}
              onSaved={onSaved}
              onCancel={onCancel}
              onDelete={onDelete}
            />
          ) : (
            <DashboardRegister
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

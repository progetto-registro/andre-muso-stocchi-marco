import { useEffect, useState } from "react";
import TableRegister from "./TableRegister";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Alert, Box, Container } from "@mui/material";
import type { Lezione } from "../../models/Lezione";
import EditLesson from "../EditLesson/EditLesson";
import type { ClassRegisterMode } from "../../models/ClassRegisterMode";

export default function ClassRegister() {
  const navigate = useNavigate();
  const location = useLocation(); //magari lavorare su tipizzare useLocation e location quindi, che è un Location<any>
  const [lezioni, setLezioni] = useState<Lezione[]>([]);
  const [lezioneInModifica, setLezioneInModifica] = useState<
    Lezione | undefined
  >();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<ClassRegisterMode>("view");

  useEffect(() => {
    axios
      .get("https://68ce923d6dc3f350777f648e.mockapi.io/Lezioni") // indirizzo da mettere http://localhost:8080/api/lezioni
      .then((res) => {
        console.log(res.data);
        setLezioni(res.data);
        setRefetch(false);
      })
      .catch((error) => {
        setRefetch(false);
        //rivedere error code in swagger
        console.log(error);
        setErrorMessage("");
        if (error.response) {
          const s = error.response.status;
          if (s === 401) {
            setErrorMessage("Non autorizzato.");
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

  // aggiungere gli errormessage a questo sotto ⬇️ useEffect ; null quando vuoto così non rendera. capire come aggiungere bottoncino per eliminare messaggio ( bottoncino " dentro allert" o wrappare entrambi in un Horizontal / box / ? trova layout giusto)
  // mettere le cose apposto in base al path, che può essere cambiato sia dagli onQualcosa che arrivano da sotto, sia da utente
  useEffect(() => {
    const path = location.pathname; // es. /class-register/123/edit

    // 1) /class-register/new
    if (path.endsWith("/new")) {
      setLezioneInModifica({} as Lezione); // “form vuoto”
      setMode("new");
      return;
    }

    // 2) /class-register/:id/edit (il parsing si poteva fare con useParams ; se poi tempo facciamo)
    const parts = path.split("/").filter(Boolean); //rimuove valori falsy ( come NaN ma anche "" che ci sarebbe prima di /)
    // ["class-register", "123", "edit"] (se non mettevi filter(Boolean) veniva ["", ...quello])
    if (
      parts.length === 3 &&
      parts[0] === "class-register" &&
      parts[2] === "edit"
    ) {
      const id = Number(parts[1]);

      if (Number.isNaN(id)) {
        setMode("view");
        navigate("/class-register", { replace: true });
        return;
      }
      const maybeLesson = (location.state as any)?.lezione as
        | Lezione
        | undefined;

      if (maybeLesson) {
        setLezioneInModifica(maybeLesson); // passata via navigate(state), se arrivi da flusso appl
        setMode("edit");
      } else {
        // fallback: se ricarichi pagina o arrivi da link e non hai lo state

        //non esiste un api endpoint per fetchare solo una lezione, e tutte le fetchamo già in sto comp di fatto., qunidi
        //al più aggiungere refetch togglando stato apposta   . sennò se ci fosse per fare fetch dentro useEffect (()=>{})() per bypassare il noasync ? informarsi
        const maybeFound = lezioni.find((l) => l.id === id);
        if (maybeFound) {
          setLezioneInModifica(maybeFound);
          setMode("edit");
        } else {
          setMode("view");
          navigate("/class-register", {
            replace: true,
            state: { flash: "Lezione non trovata" },
          });
        }
      }

      return;
    }

    // 3) default: se path non è ne con new ne /:id/edit
    setMode("view");
    setLezioneInModifica(undefined);
  }, [location.pathname, location.state]); //fondamentale il pathname; difficile che cambi anche lo state senza un navigate e un pathname.. un navigate da solo non può cambiare. vabbe navigate appunto non serviva l ho tolto

  // Handler passati ai figli

  const onCreate = () => {
    navigate("/class-register/new");
  };
  const onModify = (lezione: Lezione) => {
    // porta i dati con te (UI più reattiva); fallback fetch gestito nell'useEffect
    setLezioneInModifica(lezione);
    navigate(`/class-register/${lezione.id}/edit`, { state: { lezione } });
  };
  const onSaved = (saved: Lezione) => {
    // AGGIUNGERE PUT / POST  e condizionare aggiornamento cache locale : se BE rifiuta non aggiorniamo qua, e no redirect verso class-register
    // aggiorna lezioni array locale
    setLezioni((prev) => {
      const i = prev.findIndex((l) => l.id === saved.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = saved;
        return copy;
      } // se siamo in /edit lo cambia senza spostarlo
      return [saved, ...prev]; //se siamo in /new lo aggiunge in testa

      // guardare se backend le conserva ordinate per data o per ordine di inserimento; creare ordinamento per renderarle sempre ordinate nella tab visualizzazione RegisterTable Row Sorted
    });
    navigate("/class-register"); // torna alla lista (cambia navigation che chiama useEffect che cambia lezioneInModifica che cambia render condizionale)
  };
  const onCancel = () => navigate("/class-register"); // per evitare back del browser

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
          maxWidth="sm" // con tutto a 100vh vw si perde senso della responsività : capire meglio ma di base lasciare i 100 solo sulla box (sfondo) e idem per il position fixed
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
          {mode !== "view" ? ( //lezioneInModifica ===null => falsy => registro visualizzazione; lezioneInModifica {} as Lezione => truly =>lezioneInModifica.id === undefined => new ; Lezione vera completa => .id truly => edit
            <EditLesson
              lezioneInModifica={lezioneInModifica}
              onSaved={onSaved}
              onCancel={onCancel}
            />
          ) : (
            <TableRegister
              lezioni={lezioni}
              onCreate={onCreate}
              onModify={onModify}
              onReload={() => {
                setRefetch(true);
              }}
            />
          )}
        </Container>
      </Box>
    </>
  );
}

import { useEffect, useState } from "react";
import TableRegister from "./TableRegister";
import axios from "axios";
import { Alert, Box, Container } from "@mui/material";
import type { Lezione } from "../../models/Lezione";

export default function ClassRegister() {
  const [lezioni, setLezioni] = useState<Lezione[]>([]);

  const [errorMessage, seterrorMessage] = useState<string>("none");
  useEffect(() => {
    axios
      .get("https://68ce923d6dc3f350777f648e.mockapi.io/Lezioni") // indirizzo da mettere http://localhost:8080/api/lezioni
      .then((res) => {
        console.log(res.data);
        setLezioni(res.data);
      })
      .catch((error) => {
        console.log(error);
        seterrorMessage("");
        if (error.response) {
          const s = error.response.status;
          if (s === 401) {
            seterrorMessage("Non autorizzato.");
          } else if (s === 404) {
            seterrorMessage("API non trovata.");
          } else {
            seterrorMessage("Errore del server. Riprova più tardi.");
          }
        } else if (error.request) {
          seterrorMessage(
            "Nessuna risposta dal server. Controlla la connessione."
          );
        } else {
          seterrorMessage("Errore applicativo imprevisto.");
        }
      });
  }, []);

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
          <Alert
            severity="error"
            sx={{
              display: { xs: "block", md: errorMessage },
            }}
          >
            {errorMessage}
          </Alert>
          <TableRegister lezioni={lezioni}></TableRegister>
        </Container>
      </Box>
    </>
  );
}

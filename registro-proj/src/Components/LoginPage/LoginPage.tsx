import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import LoginForm from "../../shared/LoginForm";
import type { LoginUser } from "../../models/LoginUser";

export default function LoginPage(props: any) {
  //const [formData, setFormData] = useState<Partial<LoginUser>>({});
  const [formMessage, setFormMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();

  //penso sia meno sbatta metterla dentro al comp, così hai accesso diretto alle props che ti passo da App ad esempio, ma anche al navigate = usenavigate che ti farai

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    formData: LoginUser
  ) => {
    setFormMessage("");
    axios
      .post("/api/login", formData)
      .then(function response() {
        console.log(response);
        props.onLogin(formData);
        setSubmitting(false);
        navigate("/home", { replace: true });
      })
      .catch((error: AxiosError<any>) => {
        console.error(error);
        if (error.response) {
          const errorStatus = error.response.status;
          if (errorStatus === 400) setFormMessage("Dati non validi");
          else if (errorStatus === 401) setFormMessage("Non autorizzato.");
          else if (errorStatus === 404) setFormMessage("API non trovata.");
          else setFormMessage("Errore del server. Riprova più tardi.");
        } else if (error.request) {
          setFormMessage("Nessuna risposta dal server. Controlla la connessione.");
        } else {
          setFormMessage("Errore applicativo imprevisto.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  // ah mettici anche un campo che mostra credenziali errate se ricevi un ?? 440?? penso sia quello che il prof vuole usare se l utente che vuole loggarsi non esiste. penso che per avere la res di una post e quindi avere il cod errore si faccia come con le get
  return (
    <Box
      sx={{
        position: "fixed", // provandoi a togliere le scrollbar
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw", // minWidth non usarli, potrebbero attivare e usare anche un po di scrollbar su schermi piccoli, usa width: 100% , o niente, perchè è il default.
        // padding tolti perchè magari uscivano dai 100vw e 100vh e facevano comparire le scrollbar
        display: "flex",
        placeItems: "center",
        bgcolor: "#6a7780ff",
        overflow: "hidden",
        overflowY: "hidden",
      }}
    >
      {/* CARD */}
      <Container
        maxWidth="sm" /*Container: un comp comodo per gestire responsive dei suoi figli in una bottta sola */
      >
        <LoginForm
          formTitle="Login"
          formMessage={formMessage}
          submitting={submitting}
          onSubmit={handleSubmit}
          onSubmitting={() => setSubmitting(true)} // potevamo farlo qua nel submit ee evitarci di mandare giù callback ma vabbe
        />
      </Container>
    </Box>
  );
}

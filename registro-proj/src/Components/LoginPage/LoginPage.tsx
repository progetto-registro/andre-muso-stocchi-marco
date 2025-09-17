import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import type { LoginUser } from "../../models/LoginUser";
import SignupForm from "../../shared/SignupForm";
import { loginFormSettings } from "../../models/FormSettings";

export default function LoginPage(props: any) {
  //serve per scrivere l'eventuale messaggio di errore direttamente nella pagina
  const [formMessage, setFormMessage] = useState<string>("");
  //serve per gestire l'invio di tutti i dati del form
  const [submitting, setSubmitting] = useState<boolean>(false);

  //serve a gestire facilmente la navigazione tra le pagine
  const navigate = useNavigate();

  const handleSubmit = async (formData: LoginUser) => {
    setFormMessage("");
    axios
      .post("/api/auth/login", formData)
      .then(function response() {
        console.log(response);
        props.onLogin(formData);
        setSubmitting(false);
        navigate("/home", { replace: true });
      })
      .catch((error: AxiosError<any>) => {
        setSubmitting(false);
        console.error(error);
        if (error.response) {
          const errorStatus = error.response.status;
          if (errorStatus === 400) setFormMessage("Dati mancanti");
          else if (errorStatus === 404) setFormMessage("Dati errati");
          else setFormMessage("Errore del server. Riprova più tardi.");
        } else if (error.request) {
          setFormMessage(
            "Nessuna risposta dal server. Controlla la connessione."
          );
        } else {
          setFormMessage("Errore applicativo imprevisto.");
        }
      });
  };

  return (
    <>
      {/**Questo contiene la card, in questo caso è il body della pagina di questo componente*/}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          display: "flex",
          placeItems: "center",
          bgcolor: "#6a7780ff",
          overflow: "hidden",
          overflowY: "hidden",
        }}
      >
        {/**Questa è la card, contiene i due input, username e password, e il bottone*/}
        <Container maxWidth="sm">
          <SignupForm
            formSettings={loginFormSettings}
            formMessage={formMessage}
            submitting={submitting}
            onSubmit={handleSubmit as any}
            onSubmitting={() => setSubmitting(true)}
          />
        </Container>
      </Box>
    </>
  );
}

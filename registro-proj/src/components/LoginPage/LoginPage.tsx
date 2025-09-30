import { useState } from "react";
import axios, { type AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import type { LoginUser } from "../../models/LoginUser";
import SignupForm from "../../shared/SignupForm";
import { loginFormSettings } from "../../models/FormSettings";
import { useLoading } from "../../shared/loading/hooks";
import type { User } from "../../models/User";

type LoginPageProps = {
  onLogin: (user: User) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  //serve per scrivere l'eventuale messaggio di errore direttamente nella pagina
  const [formMessage, setFormMessage] = useState<string>("");
  //serve per gestire l'invio di tutti i dati del form
  const [submitting, setSubmitting] = useState<boolean>(false);

  //serve a gestire facilmente la navigazione tra le pagine
  const navigate = useNavigate();
  const { runWithLoading } = useLoading();

  const handleSubmit = async (formData: LoginUser) => {
    setFormMessage("");
    await runWithLoading(
      async () => {
        try {
          const res = await axios.post<LoginUser, AxiosResponse<User>>(
            "/api/auth/login",
            formData
          );
          console.log(res);
          setSubmitting(false);
          if (res.data) {
            //molto prob non serve perche se !res.data => eccezione

            onLogin(res.data);
            navigate("/home", { replace: true }); //🔴 rotella deve cambiare scritta mentre è on , sennò diamo direttamente login
          }
        } catch (err) {
          setSubmitting(false);
          if (axios.isAxiosError(err)) {
            // se err è AxiosError => true
            if (err.response) {
              // const s = err.response.status; // volendo comportamenti per stato ma non ci serve cuz be ci da stringa errore come corpo del body e noi la usiamo.
              setFormMessage(
                err.response.data ?? "Errore applicativo imprevisto."
              ); //.data per il body della response , quello che in postman si chiama body
            } else if (err.request) {
              setFormMessage("Timeout. Nessuna risposta dal server.");
            }
          } else {
            setFormMessage("Errore applicativo imprevisto.");
          }
        }
      },
      "Loggin in..",
      750,
      true
    ); //true non serve, è default
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
            onSubmit={handleSubmit}
            onSubmitting={() => setSubmitting(true)}
          />
        </Container>
      </Box>
    </>
  );
}

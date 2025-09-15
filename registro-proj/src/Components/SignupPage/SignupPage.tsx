import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { User } from "../../models/User";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import SignupForm from "../../shared/SignupForm";
import type { FormSettings } from "../../models/FormSettings";

export default function SignupPage(props: any) {
  //l oggetto Partial<User> che se validato diventa User e che viene inviato
  const [formMessage, setFormMessage] = useState<string>(""); // Con validazione nativa con Box type form sicuramente c erano modi migliori.. messaggio generico in basso potremmo differenziare a seconda del campo però ci sarebbe da pensarci perchè isFormComplete al momento non penso possa returnare stringa
  const [submitting, setSubmitting] = useState<boolean>(false); //così  uno non può spammare summing durante controllo fecth perchè si disabilita bottone
  // stati per password

  const navigate = useNavigate(); //dopo submit si va alla home

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>, // forse visto che preventDefault lo possiamo fare di sotto si può togliere e anche semplifica props di callback typing etc
    formData: User
  ) => {
    setFormMessage("");
    axios
      .post("/api/signup", formData)
      .then(function (response) {
        console.log(response);
        props.onSignup(formData);
        setSubmitting(false);
        navigate("/home", { replace: true }); //così dopo che uno si registra se fa indietro torna a home e non a signup
      })
      .catch((error: AxiosError<any>) => {
        setSubmitting(false);
        console.error(error);
        if (error.response) {
          const s = error.response.status;
          if (s === 400 || s === 409) {
            setFormMessage(
              "Utente già esistente (CF duplicato) o dati non validi."
            );
          } else if (s === 401) {
            setFormMessage("Non autorizzato.");
          } else if (s === 404) {
            setFormMessage("API non trovata.");
          } else {
            setFormMessage("Errore del server. Riprova più tardi.");
          }
        } else if (error.request) {
          setFormMessage(
            "Nessuna risposta dal server. Controlla la connessione."
          );
        } else {
          setFormMessage("Errore applicativo imprevisto.");
        }
      });
  };

  const signupFormSetting: FormSettings={
    visible: ["name", "surname", "cf", "email", "password", "confirmPassword","date"],
    immutabile: ["cf"],
    textButton="Registrati",
  }

  // da cambiare molto quando guardiamo bene  questione degli stili temi etc con mui. per ora così che almeno c'è
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
        <SignupForm
          formSettings={signupFormSetting}
          formTitle="Registrazione"
          formMessage={formMessage}
          submitting={submitting}
          onSubmit={handleSubmitk}
          onSubmitting={() => setSubmitting(true)} // potevamo farlo qua nel submit ee evitarci di mandare giù callback ma vabbe
        />
      </Container>
    </Box>
  );
}

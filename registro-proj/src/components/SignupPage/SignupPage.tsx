import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { User } from "../../models/User";
import { Box, Container } from "@mui/material";

import SignupForm from "../../shared/SignupForm";
import { signupFormSettings } from "../../models/FormSettings";
import { popupAlert} from "../../shared/utils";
import { useLoading } from "../../shared/loading/hooks";

import {
  useNavigateWithRotella,
  useHideRotella,
} from "../../shared/loading/hooks";

type SignupPageProps = {
  onLogin: (user: User) => void;
};

export default function SignupPage({ onLogin }: SignupPageProps) {
  //l oggetto Partial<User> che se validato diventa User e che viene inviato
  const [formMessage, setFormMessage] = useState<string>(""); // Con validazione nativa con Box type form sicuramente c erano modi migliori.. messaggio generico in basso potremmo differenziare a seconda del campo però ci sarebbe da pensarci perchè isFormComplete al momento non penso possa returnare stringa
  const [submitting, setSubmitting] = useState<boolean>(false); //così  uno non può spammare summing durante controllo fecth perchè si disabilita bottone
  // stati per password
  const { runWithLoading } = useLoading();

  useHideRotella();

  const navigateRotella = useNavigateWithRotella();

  const handleSubmit = async (formData: User) => {
    setFormMessage("");

    runWithLoading(
      () =>
        axios
          .put("/api/auth/signup", formData)
          .then(function (response) {
            console.log(response);
            onLogin(formData);
            setSubmitting(false);
            popupAlert("Registrazione Avvenuta con successo!", "verde"); //toast non aspetta,  uscirà fuori prima della scomparsa della rotella. sennò sleep(690) prima di toast e navigate ma davvero brutto
            navigateRotella("/home", { message: "Benvenuto", replace: true }); //così dopo che uno si registra se fa indietro torna a home e non a signup
          })
          .catch((error) => {
            setSubmitting(false);
            console.error(error);
            if (axios.isAxiosError(error)) {
              // se err è AxiosError => true
              if (error.response) {
                // const s = err.response.status; // volendo comportamenti per stato ma non ci serve cuz be ci da stringa errore come corpo del body e noi la usiamo.
                setFormMessage(
                  error.response.data ?? "Errore applicativo imprevisto."
                ); //.data per il body della response , quello che in postman si chiama body
              } else if (error.request) {
                setFormMessage("Timeout. Nessuna risposta dal server.");
              } else {
                setFormMessage("Errore applicativo imprevisto.");
              }

              // navigateLandingPageIfNotAuth(error, navigate); // qua non serve, qua non sei auth //ci stava metterlo dentro if response che tanto cade li ma così mi sento piu safe
            }
          }),
      "Registrazione in corso",
      700
    );
  };

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
        sx={{
          transform: "scale(0.67)",
          transformOrigin: "center center",
        }}
      >
        <SignupForm
          formSettings={signupFormSettings}
          formMessage={formMessage}
          submitting={submitting}
          onSubmit={handleSubmit as any} //bruttissimo , ma sennò dovevo farla generics, usarla a seconda del comp con T extends User o LoginUser e rivedere tutti i metodi nel form. magari poi ci studio meglio. Così poco sicuro. altra soluzione fare tante prop opzionali di submit con tante func handle submit diverse usate a seconda del padre
          onSubmitting={() => setSubmitting(true)} // potevamo farlo qua nel submit ee evitarci di mandare giù callback ma vabbe
        />
      </Container>
    </Box>
  );
}

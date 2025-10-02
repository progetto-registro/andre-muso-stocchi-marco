import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import type { User } from "../../models/User";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import SignupForm from "../../shared/SignupForm";
import {
  modificaProfiloFormSettings,
  visualizzaProfiloFormSettings,
} from "../../models/FormSettings";
import { navigateLandingPageIfNotAuth, sleep } from "../../shared/utils";
import { useLoading } from "../../shared/loading/hooks";
import type { PageMode } from "../../models/PageMode";

import {
  useNavigateWithRotella,
  useHideRotella,
} from "../../shared/loading/hooks";

type ProfilePageProps = {
  loggedUser: User | undefined;
  onLogin: (user: User) => void;
};

export default function ProfilePage({ loggedUser, onLogin }: ProfilePageProps) {
  //l oggetto Partial<User> che se validato diventa User e che viene inviato
  const [formMessage, setFormMessage] = useState<string>(""); // Con validazione nativa con Box type form sicuramente c erano modi migliori.. messaggio generico in basso potremmo differenziare a seconda del campo però ci sarebbe da pensarci perchè isFormComplete al momento non penso possa returnare stringa
  const [submitting, setSubmitting] = useState<boolean>(false); //così  uno non può spammare summing durante controllo fecth perchè si disabilita bottone
  const [mode, setMode] = useState<PageMode>("view");
  const navigate = useNavigate();

  const { runWithLoading, setMessage } = useLoading();

  useHideRotella();
  const navigateRotella = useNavigateWithRotella();

  const handleSubmit = async (formData: User) => {
    if (mode === "view") {
      setMode("edit");
      return;
    } else {
      await runWithLoading(
        () =>
          axios // senza .then/.catch si fa runWithLoading(async ()=>{le cose con await anche entro a try/catch. usi async perchè vuoi usare await o throw, non perchè ritorna una Promise}), message, ms) .le graffe perchè axiox.get.then..catch è una fluent .. è progr funz.. è come un unica istruzione quindi non necessarie {return axios.get. .. .catch()}, ma puoi metterlo.  async serve 1 per forzare il tipo di ritorno a Promise<T> , 2 perche ti sblocca uso di await e throw assieme a await e throw compone syntax sugar per assemblare piu promise aspettandone varie con await che può sia portare ad un resolve che a un reject, o lanciando dei reject con throw direttamente. MA SE COME CON CATCH/THEN non ci sono await o throw, non serve async. Se lo metti è inutile ma non te lo mette in rosso.  NB gli await returnano delle promise al chiamante coordinandosi con async
            .post("/api/auth/modifica", formData)
            .then(function (response) {
              console.log(response);
              onLogin(formData);
              setSubmitting(false);
              setMode("view"); //niente sleep qua, se torna in view sotto la rotella ok
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
                }
              } else {
                setFormMessage("Errore applicativo imprevisto.");
              }

              if (navigateLandingPageIfNotAuth(error, navigate)) {
                setMessage("Non Autorizzato");
              }
              // accompagnamento a landingpage con rotella (anche se doppio sleep 1.4s brutto)
            }),
        "carincamento modifiche",
        700
      );
    }
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
      >
        <SignupForm
          formSettings={
            mode === "view"
              ? visualizzaProfiloFormSettings
              : modificaProfiloFormSettings
          }
          formMessage={formMessage}
          submitting={submitting}
          onSubmit={handleSubmit as any} //bruttissimo , ma sennò dovevo farla generics, usarla a seconda del comp con T extends User o LoginUser e rivedere tutti i metodi nel form. magari poi ci studio meglio. Così poco sicuro. altra soluzione fare tante prop opzionali di submit con tante func handle submit diverse usate a seconda del padre
          onSubmitting={() => setSubmitting(true)} // potevamo farlo qua nel submit ee evitarci di mandare giù callback ma vabbe
          incomingUser={loggedUser}
        />
      </Container>
    </Box>
  );
}

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import type { User } from "../../models/User";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@mui/material";
import SignupForm from "../../shared/SignupForm";
import {
  type FormSettings,
  modificaProfiloFormSettings,
  signupFormSettings,
  visualizzaProfiloFormSettings,
} from "../../models/FormSettings";

type ProfilePageProps={
  loggedUser:User;
  onLogin:(user:User)=>void;
}






export default function ProfilePage({loggedUser,onLogin}:ProfilePageProps) {
  //l oggetto Partial<User> che se validato diventa User e che viene inviato
  const [formMessage, setFormMessage] = useState<string>(""); // Con validazione nativa con Box type form sicuramente c erano modi migliori.. messaggio generico in basso potremmo differenziare a seconda del campo però ci sarebbe da pensarci perchè isFormComplete al momento non penso possa returnare stringa
  const [submitting, setSubmitting] = useState<boolean>(false); //così  uno non può spammare summing durante controllo fecth perchè si disabilita bottone
  const [view,setView] =  useState<boolean>(true);
  
  



const handleSubmit = async (formData: User) => 
{
  if(view)
  {
    setView(false);
    return;

  }else{
    axios
      .post("/api/auth/modifica", formData)
      .then(function (response) {
        console.log(response);
        onLogin(formData); //todo
        setSubmitting(false);
        
        
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


  }



  /*const handleSubmit = async (formData: User) => {
    setFormMessage("");

    axios
      .post("/api/auth/modifica", formData)
      .then(function (response) {
        console.log(response);
        props.onLoggin(formData); //todo
        setSubmitting(false);
        
        
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
*/
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
          formSettings={view? visualizzaProfiloFormSettings : modificaProfiloFormSettings}
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

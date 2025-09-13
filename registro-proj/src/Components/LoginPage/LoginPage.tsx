import { useState } from "react";
import "./LoginPage.css";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage(props: any) {
  const[formData, setFormData] = useState({username: "", password: ""});
  const [formMessage, setFormMessage] = useState<string>("");
  
  const navigate = useNavigate();

  const handleChange = (event: any) => {
    const {name, value} = event.target;
    setFormData((prevFormData) => ({...prevFormData, [name]: value}))
  }

  //penso sia meno sbatta metterla dentro al comp, così hai accesso diretto alle props che ti passo da App ad esempio, ma anche al navigate = usenavigate che ti farai
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormMessage("");
    /* chiedere

    if (!isFormComplete(formData)) {
      setFormMessage("Almeno un campo è imcompleto (personalizzare campo)");
      return;
    }
    */
    
    axios.post("/api/login", formData)
      .then(function (response) {
        console.log(response.data);
        //quando la imlpementi davvero , dopo aver verificato con l API che il login sia davvero ok, prima di navigare verso home chiama props.onLogin(); . E' una callback che in App.tsx setta lo stato globale a loggato e fa funzionare rounting
        props.onLogin(formData);

        navigate("/home", { replace: true });
      })
      .catch((error: AxiosError<any>) => {
        console.error(error);
        if(error.response) {
          const errorStatus = error.response.status;
          if(errorStatus === 400)
            setFormMessage("Dati non validi");
          else if (errorStatus === 401) 
            setFormMessage("Non autorizzato.");
          else if (errorStatus === 404) 
            setFormMessage("API non trovata.");
          else
            setFormMessage("Errore del server. Riprova più tardi.");
        } else if(error.request) {
          setFormMessage("Nessuna risposta dal server. Controlla la connessione.");
        } else {
          setFormMessage("Errore applicativo imprevisto.");
        }
      });
  } 

  // ah mettici anche un campo che mostra credenziali errate se ricevi un ?? 440?? penso sia quello che il prof vuole usare se l utente che vuole loggarsi non esiste. penso che per avere la res di una post e quindi avere il cod errore si faccia come con le get
  return (
    <>
    {formMessage && (
        <div className="square">
          <label>{formMessage}</label>
        </div>
    )}
      <div className="square">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange}/>
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange}/>
          <button type="submit">Accedi</button>
        </form>
      </div>
    </>
  );
}

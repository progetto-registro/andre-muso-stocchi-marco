import "./LoginPage.css";

//penso sia meno sbatta metterla dentro al comp, così hai accesso diretto alle props che ti passo da App ad esempio, ma anche al navigate = usenavigate che ti farai
function handleSubmit({}) {
  alert("Submit"); //quando la imlpementi davvero , dopo aver verificato con l API che il login sia davvero ok, prima di navigare verso home chiama props.onLogin(); . E' una callback che in App.tsx setta lo stato globale a loggato e fa funzionare rounting
} // ah mettici anche un campo che mostra credenziali errate se ricevi un ?? 440?? penso sia quello che il prof vuole usare se l utente che vuole loggarsi non esiste. penso che per avere la res di una post e quindi avere il cod errore si faccia come con le get

function LoginPage(props) {
  return (
    <>
      <div className="square">
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input type="text" placeholder="Username" />
          </label>
          <label>
            Password
            <input type="text" placeholder="Password" />
          </label>
          <button type="submit">Accedi</button>
        </form>
      </div>
    </>
  );

  /**
   * Importante per il componente
   * body {
      margin: 0;
     * display: grid;
     * place-items: center;
      min-width: 320px;
      min-height: 100vh;
    }
   */
}

export default LoginPage;

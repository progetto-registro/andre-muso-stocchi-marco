# MARCO

- [ ] 🔴
- [x] fare **login** usare API (prof ci ha detto che endpoit ci darà da sfruttare. ). usare libreria **axios** per usare API.
- [x] finire dashboard

# MUSO

- [ ] 🔴 esattamente dopo ogni get/post/put/delete axios metterci un
- [x] fare **Home** e comp card personalizzato da utilizzare nella home e magari altrove
- [x] **landing page** ( accedi o registrati) ricorda di usare **mui** di google .

# STOCCHI

- [ ] 🔴 debuggare di brutto l app usandola e segnarsi errori
- [x] **registrazione** Usare api (es, per vedere se utente c'è già PK già usata penso sia un 400 bad request , da chiedere al prof ma intanto mettiamolo così, e per pushare in DB backend la nuova uteza) . usare libreria **axios** per usare API.
- [x] iniziare **class-register** (>tableregister > row)
- [ ] 🔴 sostituire **error message** con **react tostify** e **AGGIUNGERE MESSAGGI NON ERROR**

# ANDRE

- [ ] capire meglio quando ci va l'async dvanti alle funz e perchè funz tue che dentro usano il .then o il setTimeOut non le usano
- [ ] 🔴 gestire dayjs in classregister con filtri no date foture e no date già usate lezioni già presenti (gestire data anche in dashboard)
- [ ] 🔴 sotto signup navigate login e sotto login navigate sign up
- [ ] 🔴 (anche per navigate, non solo fetch )mui per la rotellina
- [ ] 🔴 tutte le volte che ricevi un 401 non auth devi andare su pagina login
- [ ] 🔴 in class-register pagina va sotto navbar a volte , male. 🔴 inoltre non posta new lesson (putta in be prof).. guiardare se costruisco male oggetto o altro
- [ ] 🟠 trasform per vedere tutto form ? brutto . solo su signuppage ? no
- [ ] 🟡 definire type Props di tutti comp (parti da singup page)
- [ ] 🟡 provare a gestire meglio il tipo di return nel submit di signupform senza dover fare as any di sopra
- [ ] (non lo faremo) ordinare cartelle type e se avrai tempo anche giochi con index per importare da same posto
- [x] fare **routing** , tutti i comp principali (**pagine**) vuoti
- [x] fare **NavBar**
- [x] settare **API**
- [x] fare **modifica utente == profilo** riutilizzando SignupForm , leggi sotto
- [x] adattare **class-register** anche per edit e new
- [x] valutare l utilizzo di **Context** => usato per rotellina
- [ ] (non avremo tempo) approfondire **temi mui**: anche effetti come over o focus su campi o bottoni
- [ ] 🟠 controllare endpoint e funziona,mento con be
- [x] 🟢 GESTIRE USERLOGGED (fare un provider magari era meglio ma amen: unico " problema" in modifica profilo che rerendera tutto ; le altre volte no prob)
- [ ] 🔴 togliere callback di userlogged 🟢o mantenerlo, fare un context per lui .. e usarlo magari per ricordarsi login per volta dopo non so. se proprio troppo tempo
- [x] La data non fuzniona, fare context (User, isLogged, etc)

# PER TUTTI

## link utili per mui:

- **sx** prop per stili e temi: https://mui.com/system/getting-started/the-sx-prop/
- **react-comp (!!!!)**: https://mui.com/material-ui/react-select/

## librerie nuove usate

npm i @mui/material @emotion/react @emotion/styled @mui/x-date-pickers @mui/icons-material dayjs validator

npm i -D @types/validator

## per fare le cose

- I componenti che sono una pagina li chiamamo NomePage (li ho già fatti),e ognuno sta in una cartella con il suo stesso nome, tutti dentro components. In quella cartella metteremo css o altri comp che servono a quel componente (pezzi di pagina o interfaccia). Non sarà magari il miglior modo ma per noi secondo me è comodo, meglio di niente.

- usare più che possiamo componenti di **mui di google** invece che base html e in molti casi anche al posto dei custom

- **Modularità:** prediligere tanti componenti piccoli e magari riutilizzati nella stessa pagina piuttosto che un componente gigante con JSX enorme e tutto dentro. Se un comp serve solo in un comp padre metterlo nella cartella del comp padre. Se invece un componente fatto da noi è utilizzato ovunque metterlo nella cartella shared. **se stai per fare un componente che pensi sia utile ovunque (es. card personalizzata o suo css) o comunque anche altrove nell app dillo al gruppo , così si fa una volta sola e risulta tutto più sensato.** Anche riguardo alla scelta di un componente mui invece di un altro che fa la stessa cosa, coordinarsi con gruppo.

# ARCHIVIO

### SignupForm.tsx in pagina signup e profilo

fare oggettone tornato da funzione in globalstaticdata che returna un **OGGETTO** con dentro array **hidden** per campi nascosti (vecchia passwrod) e dei **nomi delle etichette** (che cambiano tutti ) e dei **valori immutabili** ( cf) e aggiungere **LOGICA** come ad es **onChange** anche per **vecchiaPassword**, ma direi che c'è solo questo: anche vecchia password deve essere giusta.

- magari passare prop noId per non mostrare il "Vecchia password" quando signup.. ma comunque rimane problema "**nuovo niomeCampo**" da mettere su ogni campo .. si fa facile semrpe con prop anzi si fa tutto con una prop sola boolean volendo ma mi sembra brutto (risolve anche quello qua sotto se non vogliamo usare i nomi degli input per bloccarli)
- passargli un formdata in cui puoi modificare tutto tranne cf locckato che è pk oppure niente se per signup
- deve andare giù fieldErrors prodotto dalla validate NO VALIDAZIONE GIU
- typography di paper "Registrati" title
- onsubmit devi dargliela giù e deve attivare handlesubmit. da sopra bisogna mandare giu formMessage
- onchange ( deve mandare React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) e il form deve anche prendere formData. fare anche onDateChange perchè l onChange non gestisce anche la data
- spostare gli statiu legati a showpassword in formcompù

# AXIOS:

**Con Axios hai due tipi di errori:**

1. **Trasporto/HTTP** → Axios lancia se lo status non è 2xx. L’oggetto errore ha:

- error.response (status, data) → il server ha risposto con 4xx/5xx (controllare codice per codice)

- error.request → nessuna risposta (timeout, rete down, CORS) (controllarla come fosse un boolean, se è true c'è stato)

- else → errore di configurazione/JS (fallback per errori codice qualsiasi)

2. **Dominio/app** → QUANDO BE USA 200 PER MANDARE ERRORI: il server risponde 2xx ma nel data c’è un errore (es. {success:false, message:"..."}); non scatta il catch: devi controllarlo tu dopo il await.

```tsx
try {
  const res = await axios.post<Payload>("/endpoint", body);

  // (opzionale) Controllo "dominio" se la tua API usa 200 anche sugli errori:
  if (res.data && (res.data as any).success === false) {
    throw new Error((res.data as any).message ?? "Errore applicativo");
  }

  // ... success ...
} catch (err) {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const status = err.response.status;
      const payload = err.response.data; // messaggi dal server
      // mapping per status specifici
    } else if (err.request) {
      // nessuna risposta dal server
    } else {
      // errore di configurazione / JS
    }
  } else {
    // errore non-Axios (throw manuale, Error custom, ecc.)
  }
}
```

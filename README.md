# registro-proj

**gruppo**: andrea stocchi muso marco

Lavoro di gruppo ITS: web app con React

**pagina pubblica con accedi o registrati**(scegli tra i due)

- **accedi** => pag login (user pwd + button). Pagina che si interfaccia con un server e deve essere un po dinamica : se pwd o usernam errati non prosegui. persistenza garantita da express che comunica con db ( o file) per garantire persistenza. se sbagliati messaggi di errore al front

  se log in OK => HOME

- **registrati:** nome cognome data >18 ! sesso cf mail pwd + save btn => chiamata server in cui server controlla se CF già presente ( => si errore; CF === PK) ; se non è presnte top => home

**Su tutte pagine autenticate è presente stessa navbar che ti permette di andare ovunque** bottoncino che apre drawer (menu laterale che sta fermo) .. da pensare un attimo (in **menu drawer**: ciao tizio , ppagina profilo, pagina aggiunta studenti, registro, appello, logout)

**Pagina Home** card con stesse voci del menu-navbar

**Pagina Profilo** Vedi tutte mie info di sign up e posso modificalre ( tranne CF che è PK). La pagina sarà identica a quella della registra

**DASHBOARD: pagina aggiunta/rimozione/ vista elenco studenti** (utilizzabile per chiunque sia loggato ! no utenti std vs docenti. semplifichiamo) dove chi è loggato può aggiungere studenti alla lista di quelli esistenti ( con persistenza) inserendo nome cognome CF. si visualizza la lista degli studenti esistenti e accanto ad ognuno c'è bottone rimuovi

**registro**: _(visualizza registro passato o vai su altra pagina con + per creare pagina di nuovo giorno ( fare appello) )_ vedo tutti studenti con ore che hanno fatto per ciascun giorno, dove ogni dato visualizzato è modificabile . puoi visualizzare ( e modificare) tutte presenze pregresse oppure cliccando sul + andare su pagina nuova presenza:

**appello/ pagina nuove presneze** inserire presnze di tutti gli studennti odieerne (default) ( o selezionando giorno attraverso calendario per selezionare datadiversa da today). c'è anche un + per essere reindirizzati alla pagina di aggiunta degli
Se io completo un appello, ossia aggiungo le ore di presenza di ogni studente per una nuova giornata e faccio salva, poi la magina è vuota. non posso piu cambiare idea da li : a quel punnto per modificare devi usare la pagina registro, doove appunto si vedono e si modificano gli appelli già esistenti.

**API** da usare per parlare con backend (lo fa il prof):
**back-end su porta 8080**

- **post**
  /api/login
  /api/signup
  /api/inserisciStudente
  /api/inserisciLezione
- **delete**
  /api/eliminaStudente
- **get**
  /api/logout
  /api/studenti
  /api/lezioni

**Codici errore che il backend possibili**

200 => ok
401 => utente non aut
400 => bad request
404 => api non presente

**PREREQUISITI**: tutto l applicativo va fatto con react, mui, ts, react-router, **feedback utenti**: (spinner caricamento, risposta ad azioni come _1_ error _2_ success)

**gruppo**: andrea stocchi muso marco

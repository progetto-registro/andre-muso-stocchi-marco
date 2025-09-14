# ANDRE

- [x] fare **routing** , tutti i comp principali (**pagine**) vuoti
- [ ] fare **Home**
- [ ] fare **NavBar**
- [x] settare **API**
- [ ] valutare l utilizzo di **Context** e nel caso rivedere stato isLogged (per ora solo questo direi) . Anche le _animazioni di caricamento_ forse top con ctxt
- [ ] valutare l implementazione dei **temi mui**: anche effetti come over o focus su campi o bottoni
- [ ] se l **api non torna User completo** quando fai signup, usare interface così hai sia type di signup che type di loggato

# MARCO

- [ ] fare **login** usare API (prof ci ha detto che endpoit ci darà da sfruttare. ). usare libreria **axios** per usare API.

# MUSO

- [ ] **landing page** ( accedi o registrati) ricorda di usare **mui** di google .

# STOCCHI

- [ ] **registrazione** Usare api (es, per vedere se utente c'è già PK già usata penso sia un 400 bad request , da chiedere al prof ma intanto mettiamolo così, e per pushare in DB backend la nuova uteza) . usare libreria **axios** per usare API.

# PER TUTTI

## link utili per mui:

- **sx** prop per stili e temi: https://mui.com/system/getting-started/the-sx-prop/
- **react-comp (!!!!)**: https://mui.com/material-ui/react-select/

## librerie nuove usate

npm i @mui/material @emotion/react @emotion/styled @mui/x-date-pickers @mui/icons-material dayjs validator

npm i -D @types/validator

##

- I componenti che sono una pagina li chiamamo NomePage (li ho già fatti),e ognuno sta in una cartella con il suo stesso nome, tutti dentro components. In quella cartella metteremo css o altri comp che servono a quel componente (pezzi di pagina o interfaccia). Non sarà magari il miglior modo ma per noi secondo me è comodo, meglio di niente.

- usare più che possiamo componenti di **mui di google** invece che base html e in molti casi anche al posto dei custom

- **Modularità:** prediligere tanti componenti piccoli e magari riutilizzati nella stessa pagina piuttosto che un componente gigante con JSX enorme e tutto dentro. Se un comp serve solo in un comp padre metterlo nella cartella del comp padre. Se invece un componente fatto da noi è utilizzato ovunque metterlo nella cartella shared. **se stai per fare un componente che pensi sia utile ovunque (es. card personalizzata o suo css) o comunque anche altrove nell app dillo al gruppo , così si fa una volta sola e risulta tutto più sensato.** Anche riguardo alla scelta di un componente mui invece di un altro che fa la stessa cosa, coordinarsi con gruppo.

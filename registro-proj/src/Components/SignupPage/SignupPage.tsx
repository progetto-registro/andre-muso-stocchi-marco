import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { User } from "../../models/User";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { isStrongPassword } from "validator";

import {
  Box,
  Stack,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Paper,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";

//partial rende le chiavi opzionali, ma se cis ono devono rispettare il tipo. Record è una mappa chiave valore: in questo caso la chiave deve essere una chiave di user oppure "confirmPassword" (abbiamo aggiunto una chiave), mentre il valore deve essere stringa ( per ogni chiave = possibile input del form ci mettiamo eventuale stringa di errore)
type FieldErrors = Partial<Record<keyof User | "confirmPassword", string>>;

export default function SignupPage(props: any) {
  //l oggetto Partial<User> che se validato diventa User e che viene inviato
  const [formData, setFormData] = useState<Partial<User>>({}); // penso che partial sia un finto wrap ma alla fine solo istruzioni per il compilatore ts. permette di considerare i campi User opzionali ancvhe se non lo sono nella def. Puoi accedere ai campi dello User (es. formData) senza cose tipo formData.innerObject.name ma semplicemente formData.name, e dal momento che assegni un campo quella chiave non è piu vuota ed esiste (non so quando torna vuota non mi è servito)
  const [formMessage, setFormMessage] = useState<string>(""); // Con validazione nativa con Box type form sicuramente c erano modi migliori.. messaggio generico in basso potremmo differenziare a seconda del campo però ci sarebbe da pensarci perchè isFormComplete al momento non penso possa returnare stringa
  const [submitting, setSubmitting] = useState<boolean>(false); //così  uno non può spammare summing durante controllo fecth perchè si disabilita bottone
  // stati per password
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // utente scrive su password e cambia formData.password , scrive su ripeti password e cambia confirmPassword. Confrontandoli nel return mostra errore e inoltre al submit non submitta se non coincidono
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const navigate = useNavigate(); //dopo submit si va alla home

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string> //TextField di mui resituisce con  <HTMLInputElement> TextField normale, se ci metti prop multiline restituisce HTMLTextAreaElement e quindi se handler deve poterli accettare entrambi puoi mettere React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, ma a noi non serve (nessun multiline). se fosse l evento di una normale select sarebbe React.ChangeEvent<HTMLSelectElement>, ma la mui Select restituisce un personalizzato SelectChangeElement<T> che espone appunto {name?: string; value: unknown} dentro al suo campo .target   .. Si può importare ed usare al posto di React.ChangeEvent<{name?:string,value:string}> ed è meno sporco
  ) => {
    const target = event.target as { name?: string; value: unknown }; // target può essere di due tipi, quindi typescript non sa se c'è .name o .value dentro e quando ne se hanno tipi uguali. con quell as gli stai dicendo che almeno quei due campi ci sono e di trattarli con quei tipi. name? perchè name in SelectChangeEvent è opzionale: puoi anche non passarlo alla mui Select
    if (!target.name) {
      alert("debug: c'è un problema nella select");
      return;
    }
    const [name, value] = [target.name, target.value as string]; //value era ancora unknown ma per il cast con Number o il confronto con "" serve string

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormMessage("");
    // if (!isFormComplete(formData, confirmPassword)) {
    //   //ovviamente isFormComplete parte cmq, se ritorna false entra ma se returna true formData è User adesso
    //   setFormMessage("Almeno un campo è imcompleto (personalizzare campo)");
    //   return;
    // }
    const formValidated = validateAll(formData, confirmPassword);
    if (!formValidated.ok) {
      setFieldErrors(formValidated.errors);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);

    axios
      .post("/api/signup", formValidated.user)
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

  function validateAll(
    data: Partial<User>,
    confirm: string
  ): { ok: true; user: User } | { ok: false; errors: FieldErrors } {
    const e: FieldErrors = {};

    if (!data.name?.trim()) e.name = "Il nome è obbligatorio";
    if (!data.surname?.trim()) e.surname = "Il cognome è obbligatorio";
    if (!data.email?.trim()) e.email = "L’email è obbligatoria";
    if (!data.gender?.trim()) e.gender = "Seleziona il genere";
    if (!data.cf?.trim()) e.cf = "Il codice fiscale è obbligatorio";

    if (!data.birthDate) e.birthDate = "La data di nascita è obbligatoria";
    else if (dayjs().diff(data.birthDate, "year") < 18)
      e.birthDate = "Devi avere almeno 18 anni";

    if (!data.password) e.password = "La password è obbligatoria";
    else if (
      !isStrongPassword(data.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    )
      e.password = "Min. 8 car., 1 maiusc., 1 numero, 1 simbolo";

    if ((data.password ?? "") !== confirm)
      e.confirmPassword = "Le password non coincidono";

    return Object.keys(e).length
      ? { ok: false, errors: e }
      : { ok: true, user: data as User }; // se validato togliamo il Partial garantendo User alla submit axios post che infatti usa formValidated.user definito qua, che è di tipo User . top
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
        <Paper
          elevation={11}
          sx={{
            minWidth: "150px",
            width: "92%",
            //maxWidth: 520, // ← ingrandisci la card qui (senza responsive, sennò qui non va bene)
            p: { xs: 3, sm: 4 }, // padding interno
            borderRadius: 3, // angoli morbidi
            backdropFilter: "blur(2px)",
            bgcolor: "#4788c0ff",
            border: "1px solid",
            borderColor: "#bddffcff",
            position: "relative",
            zIndex: 10,
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: { xs: 2, sm: 3 }, fontWeight: 600, textAlign: "center" }}
          >
            Registrazione
          </Typography>

          {/* FORM */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack
              spacing={{ xs: 2, sm: 2.5 }}
              sx={{
                alignItems: "center",
              }} /*allinea tutti i figli di questoi stack */
            >
              {formMessage && <Alert severity="error">{formMessage}</Alert>}

              <TextField
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
                label="Nome"
                name="name"
                value={formData.name ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name ?? " "}
                fullWidth
              />

              {/* onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{handleChange(e)}}  è necessario perchè il noistro handler prende due tipi di eventi e gli onChange lo vogliono specifico quindi mirroriamo così e via onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{handleChange(e)}}. FORSE IL TOP ERA FARE DUE HANDLER. si poteva anche semplicemente scrivere ovunque handleChange as any e a quel punto per il typescript la firma andava bene ma mi sa che non è top */}

              <TextField
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
                label="Cognome"
                name="surname"
                value={formData.surname ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                error={!!fieldErrors.surname}
                helperText={fieldErrors.surname ?? " "}
                fullWidth
              />

              {/* <TextField
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
                label="Età"
                name="age"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.age ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                fullWidth
              /> */}

              {/*ALLA FINE MESSO DOVE VA MESSO, IN main.ts assieme ad altri provider: LocalizationProvider è un wrapper solo logico che attraverso l adapter fornito in questo caso da dayjs converte stirnghe in date di tipo Dayjs nel formato giusto a seconda della localizzazioone . ad esempio per questo l onChange del datapicker riesce a fornire un Dayjs */}
              <DatePicker // BISOGNA FORNIRGLI UN POSITION RELATIVE COSICCHè POSSA USARE POSITION ABSOLUTE BENE ("displayflex=>postionrelative=>e lui poi position absolute"). DataPicker dentro usa <Popper/> che ha position: absolute e z-index 1300. se un genitore ha overflow: hidden (come <Paper/> di default) o se metti anche solo un overflowX:hidden su una box esterna, non si sa più posizionare bene di default. magari va sotto il form
                label="Data di nascita"
                value={formData.birthDate ?? null}
                //il set della data lo chiamiamo qua per comodità ma si può fare handler apposta
                onChange={(newValue: Dayjs | null) => {
                  setFormData((prev) => ({
                    ...prev,
                    birthDate: newValue ?? undefined,
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { bgcolor: "#c0dcf5ff", borderRadius: "6px" },
                    error: !!fieldErrors.birthDate,
                    helperText: fieldErrors.birthDate ?? " ",
                  },
                }}
              />

              <TextField
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
                label="Email"
                name="email"
                type="email"
                value={formData.email ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email ?? " "}
                fullWidth
              />

              <TextField
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
                label="Codice Fiscale"
                name="cf"
                inputProps={{ maxLength: 16 }}
                value={formData.cf ?? ""}
                error={!!fieldErrors.cf}
                helperText={fieldErrors.cf ?? " "}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                }}
                fullWidth
              />

              <FormControl
                fullWidth
                error={!!fieldErrors.gender}
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
              >
                <InputLabel id="gender-label">Genere</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Genere"
                  name="gender"
                  value={formData.gender ?? ""}
                  onChange={(e: SelectChangeEvent<string>) => handleChange(e)}
                >
                  <MenuItem value="">
                    <em>Seleziona…</em>
                  </MenuItem>
                  <MenuItem value="male">Maschio</MenuItem>
                  <MenuItem value="female">Femmina</MenuItem>
                </Select>
                <FormHelperText>{fieldErrors.gender ?? " "}</FormHelperText>
              </FormControl>

              {/* PASSWORD */}
              <TextField
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
                label="Password"
                name="password"
                type={showPw ? "text" : "password"}
                value={formData.password ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e)
                }
                error={!!fieldErrors.password}
                helperText={fieldErrors.password ?? " "}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Mostra/Nascondi password"
                        onClick={() => setShowPw((v) => !v)}
                        edge="end"
                      >
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* RIPETI PASSWORD */}
              <TextField
                sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
                label="Ripeti password"
                type={showPw2 ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword ?? " "}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Mostra/Nascondi password"
                        onClick={() => setShowPw2((v) => !v)}
                        edge="end"
                      >
                        {showPw2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{
                  alignSelf: "center",
                  mt: 1,
                  px: { xs: 4, sm: 6 },
                  bgcolor: "#ebee59ff",
                  color: "magenta",
                  fontSize: "1.5rem",
                  borderRadius: "6px",
                }}
                fullWidth
              >
                {submitting ? "Invio..." : "Registrati"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

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
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import {type FormSettings} from '../models/FormSettings';
import type { User } from "../models/User";
import type { FieldErrors } from "../models/FieldErrors";
import dayjs, { Dayjs } from "dayjs";
import { isStrongPassword } from "validator";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { Visibility, VisibilityOff } from "@mui/icons-material";



type SignupFormProps = {
  //onSubmit: React.FormEventHandler<HTMLFormElement>; // anche questo indagare differenze  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  onSubmit: ((
    e?: React.FormEvent<HTMLFormElement>,
    data?: User
  ) => void | Promise<void>);
  formSettings: FormSettings;
  formMessage: string;
  submitting: boolean;
  onSubmitting: () => void;
  formTitle: string;
  // fieldErrors: FieldErrors[]; no mettiamo uno stato qua;  niente su giu.  validazione in loco
};


export default function SignupForm({
  onSubmit,
  formMessage,
  submitting,
  formTitle,
  onSubmitting,
  formSettings,
}: SignupFormProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formData, setFormData] = useState<Partial<User>>({});
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [showPw3, setShowPw3] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    
    if(formSettings.textButton==="Modifica") {onSubmit(); return;}
    const formValidated = validateAll(formData, confirmPassword);
    e.preventDefault();
    if (!formValidated.ok) {
      setFieldErrors(formValidated.errors);
      return;
    }
    onSubmitting();

    onSubmit(e, formData as User);
  }

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
  return (
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
        {formTitle}
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

          {formSettings.visible.includes("name") && <TextField
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
          />}
          

          

          {/* onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{handleChange(e)}}  è necessario perchè il noistro handler prende due tipi di eventi e gli onChange lo vogliono specifico quindi mirroriamo così e via onChange={(e: React.ChangeEvent<HTMLInputElement>)=>{handleChange(e)}}. FORSE IL TOP ERA FARE DUE HANDLER. si poteva anche semplicemente scrivere ovunque handleChange as any e a quel punto per il typescript la firma andava bene ma mi sa che non è top */}
            {formSettings.visible.includes("surname") &&
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
          }
          
          {/*ALLA FINE MESSO DOVE VA MESSO, IN main.ts assieme ad altri provider: LocalizationProvider è un wrapper solo logico che attraverso l adapter fornito in questo caso da dayjs converte stirnghe in date di tipo Dayjs nel formato giusto a seconda della localizzazioone . ad esempio per questo l onChange del datapicker riesce a fornire un Dayjs */}
          {formSettings.visible.includes("data") && 
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
          />}

          
          {formSettings.visible.includes("email") &&
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
          }
          
          {formSettings.visible.includes("cf") && 
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
          }
          
          {formSettings.visible.includes("gender") &&
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
          }
          
          {/*OLD PASSWORD */}

          <SignupForm settingsForm={check? settingModifica : settingVisualizza} />

          {formSettings.visible.includes("oldPassword") &&
           <TextField
            sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
            label="Password"
            name="password"
            type={showPw3 ? "text" : "password"}
            value={formData.password ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e)
            }
            error={!!fieldErrors.oldPassword}
            helperText={fieldErrors.oldPassword ?? " "}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Mostra/Nascondi password"
                    onClick={() => setShowPw3((v) => !v)}
                    edge="end"
                  >
                    {showPw3 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          }

          {/* PASSWORD */}
          {formSettings.visible.includes("password") &&
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
            InputProps={!(formSettings.textButton==="Modifica")? {
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
            } : undefined}
          />
          }
         

          {/* RIPETI PASSWORD */}
          {formSettings.visible.includes("confirmPassword") && 
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
          }
          

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
            {submitting ? "Caricamento" : formSettings.textButton}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

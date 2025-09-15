import { useState } from "react";
import { Alert, Box, Button, IconButton, InputAdornment, Paper, Stack, TextField, Typography, type SelectChangeEvent } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { LoginUser } from "../models/LoginUser";
import type { FieldErrors } from "../models/FieldErrors";

type LoginFormProps = {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    data: LoginUser
  ) => void | Promise<void>;
  formMessage: string;
  submitting: boolean;
  onSubmitting: () => void;
  formTitle: string;
};

export default function LoginForm({
  onSubmit,
  formMessage,
  submitting,
  formTitle,
  onSubmitting,
}: LoginFormProps) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<Partial<LoginUser>>({});
  const [showPw, setShowPw] = useState(false);

  //funzione che gestisce il submit
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const formValidated = validateAll(formData);
    e.preventDefault();
    //controlla che tutti i campi siano inserti
    if (!formValidated.ok) {
      setFieldErrors(formValidated.errors);
      return;
    }
    onSubmitting();

    onSubmit(e, formData as LoginUser);
  }

  //evento che gestisce i cambiamenti nel form
  const handleChange = (
    //gli eventi si verificano quando qualcosa viene cambiato o dall'user o dal browser
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const target = event.target as { name?: string; value: unknown }; // target può essere di due tipi, quindi typescript non sa se c'è .name o .value dentro e quando ne se hanno tipi uguali. con quell as gli stai dicendo che almeno quei due campi ci sono e di trattarli con quei tipi. name? perchè name in SelectChangeEvent è opzionale: puoi anche non passarlo alla mui Select
    //controlla che negli input siano modificati i campi corretti. es: username e name possono causare problemi nel caso si provi a scambiare uno con l'altro
    if (!target.name) {
      alert("debug: c'è un problema nella select");
      return;
    }
    const [name, value] = [target.name, target.value as string];
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //funzione che controlla che gli input siano inseriti e non siano vuoti
  function validateAll(
      data: Partial<LoginUser>,
    ): { ok: true; user: LoginUser } | { ok: false; errors: FieldErrors } {
      const e: FieldErrors = {};
  
      if (!data.username?.trim()) e.name = "Il nome è obbligatorio";
      if (!data.password) e.password = "La password è obbligatoria";
      
      //Qua probabilmente dovrebbe dare in ritorno un User e non un LoginUser
      return Object.keys(e).length
        ? { ok: false, errors: e }
        : { ok: true, user: data as LoginUser };
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

          {/**USERNAME */}
          <TextField
            sx={{ bgcolor: "#c0dcf5ff", borderRadius: "6px" }}
            label="Username"
            name="username"
            value={formData.username ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
            }}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name ?? " "}
            fullWidth
          />

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
  );
}


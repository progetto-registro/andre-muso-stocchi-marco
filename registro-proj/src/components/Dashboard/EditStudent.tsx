import { useEffect, useState } from "react";
import type { Studente } from "../../models/Studente";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

type EditStudentProps = {
  studenteInModifica?: Studente;
  onSaved: (studente: Studente) => void;
  onCancel: () => void;
  onDelete?: (studente: Studente) => void;
};

export default function EditStudent({
  studenteInModifica,
  onSaved,
  onCancel,
  onDelete,
}: EditStudentProps) {
  const [form, setForm] = useState<Studente>({
    cf: "",
    nome: "",
    cognome: "",
    dataNascita:"", // da implementare
    sesso: undefined, // da implementare (può essere "M" o "F" o undefined ma validazione solo M o F)
  });

  //Nel caso il studente va solo modificato
  useEffect(() => {
    if (studenteInModifica) {
      setForm(studenteInModifica);
    }
  }, [studenteInModifica]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaved(form);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 400 }}
    >
      <Stack spacing={2}>
        <Typography variant="h5">
          {studenteInModifica ? "Modifica Studente" : "Nuovo Studente"}
        </Typography>

        <TextField
          label="Nome"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <TextField
          label="Cognome"
          name="cognome"
          value={form.cognome}
          onChange={handleChange}
          required
        />

        <TextField
          label="Codice Fiscale"
          name="cf"
          value={form.cf}
          onChange={handleChange}
          required
          disabled={!!studenteInModifica} // non modifico il CF in edit
        />

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary">
            Salva
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Annulla
          </Button>
          {studenteInModifica && onDelete && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(form)}
            >
              Elimina
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

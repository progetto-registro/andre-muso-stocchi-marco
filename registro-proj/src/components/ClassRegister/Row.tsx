import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { Lezione } from "../../models/Lezione";

type LezioneProps = {
  lezione: Lezione;
  onModify: (lezione: Lezione) => void;
};

export default function Row({ lezione }: LezioneProps) {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      {/* Riga che c'è sempre, con ID e Data lezione */}
      <TableRow>
        {/*bottone  per togglare open che collapsa le row degli studenti*/}
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/*id lez*/}
        <TableCell component="th" scope="row">
          {lezione.id}
        </TableCell>
        {/*data lezione */}
        <TableCell align="right">{String(lezione.dataLezione)}</TableCell>
        {/*bottone che chiama la callback onModify  e passa su la lezione */}
        <TableCell>
          <Button variant="contained">MODIFICA</Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Alunni Presenti
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Codice Fiscale</TableCell>
                    <TableCell>Ore</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lezione.studenti.map((studente) => (
                    <TableRow key={studente.cf}>
                      <TableCell component="th" scope="row">
                        {studente.cf}
                      </TableCell>
                      <TableCell>{studente.ore}</TableCell>
                      {/*aggiungere anche qui, per ogni studente, bottone modifica che chiama l onModify. Questa volta settandogli anche studenteDaModificare */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

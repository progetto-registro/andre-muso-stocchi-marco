import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Studente } from "../../models/Studente";

type DashboardTableProps = {
  studenti: Studente[] | undefined;
  onModify: (studente: Studente) => void;
  onCreate: () => void;
  onReload: () => void;
  onDelete: (studene: Studente) => void;
};

export default function DashboardTable({
  studenti,
  onModify,
  onDelete,
  onCreate,
}: DashboardTableProps) {
  if (!studenti) {
    return <div>Caricamento...</div>;
  }
  return (
    <>
      <Box>
        <TableContainer sx={{ border: "1px solid ", borderRadius: "8px" }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nome</TableCell>
                <TableCell align="right">Cognome</TableCell>
                <TableCell align="right">Data di nascita</TableCell>
                <TableCell align="right">Sesso</TableCell>
                <TableCell align="right">Codice fiscale</TableCell>
                <TableCell align="right">
                  <Button onClick={onCreate}>Aggiungi Studente</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...(studenti ?? [])]
                .sort((a, b) => a.cognome.localeCompare(b.cognome))
                .map((studente) => (
                  <TableRow key={studente.cf}>
                    <TableCell />
                    <TableCell>{studente.nome}</TableCell>
                    <TableCell align="right">{studente.cognome}</TableCell>
                    <TableCell align="right">{studente.dataNascita}</TableCell>
                    <TableCell align="right">{studente.sesso}</TableCell>
                    <TableCell align="right">{studente.cf}</TableCell>
                    <TableCell align="right">
                      <Button onClick={() => onModify(studente)}>
                        Modifica
                      </Button>
                      <Button onClick={() => onDelete(studente)}>
                        Elimina
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

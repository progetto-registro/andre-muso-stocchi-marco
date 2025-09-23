import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Row from "./Row";
import type { Lezione } from "../../models/Lezione";

type TableRegisterProps = {
  lezioni: Lezione[] | undefined;
  onModify: (lezione: Lezione) => void;
  onCreate: () => void; // aggiungere in fondo bottone con + che chiama l onCreate (per aggiungere nuova lezione)
  onReload: () => void; // mettere un tasto per refetchare l api senza ricaricare pagina.
};

export default function TableRegister({
  lezioni,
  onModify,
}: TableRegisterProps) {
  if (!lezioni) {
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
                <TableCell>Id Lezione</TableCell>
                <TableCell align="right">Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lezioni.map(
                (
                  lezione //valutare di aggiungere un ordinamento per data così non le vediamo per ordine di push
                ) => (
                  <Row onModify={onModify} key={lezione.id} lezione={lezione} /> // {...lezione} così arrivano senza essere più una lezione, come se avessi mandato le chiavi di lezione una per una.
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

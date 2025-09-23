import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";


import Row from "./Row";
import type { Lezione } from "../../models/Lezione";






  export default function TableRegister({ lezioni }: { lezioni: Lezione[] | undefined })
{
    
    if (!lezioni) {
    return <div>Caricamento...</div>;
  }
        return<>
            
    <Box >
    <TableContainer sx={{border: '1px solid ',
        borderRadius: '8px',}}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Id Lezione</TableCell>
            <TableCell align="right">Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lezioni.map((lezione) => (
            <Row key={lezione.id} {...lezione}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>    
  

    </>
  }
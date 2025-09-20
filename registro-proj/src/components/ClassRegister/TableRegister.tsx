import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";


import Row from "./Row";

  interface Lezione {
  id: number;
  
  dataLezione: Date;
   studenti: Studente[];
}

  interface Studente {
    cf:string
    ore:number
   
}


  export default function TableRegister({ lezioni }: { lezioni: Lezione[]})
{
    
     if (!lezioni) {
    return <div>Caricamento...</div>;
  }
        return<>
            
    <Box >
    <TableContainer sx={{border: '1px solid ',
        borderRadius: '8px',fontFamily: 'Roboto',}}>
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
            <Row key={lezione.id} {...lezione} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>    
  

    </>
  }
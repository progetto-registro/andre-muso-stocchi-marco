import { Box, Button, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import type { Lezione } from "../../models/Lezione";




export default function Row( props:  Lezione) {
  
  const [open, setOpen] =useState(false);

 
  return (
    <React.Fragment>
      <TableRow >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {props.id}
        </TableCell>
        <TableCell align="right">{String(props.dataLezione)}</TableCell>
        <TableCell> <Button variant="contained" >MODIFICA</Button></TableCell>
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
                  {props.studenti.map((studente) => (
                    <TableRow key={studente.cf}>
                      <TableCell component="th" scope="row">
                        {studente.cf}
                      </TableCell>
                      <TableCell>{studente.ore}</TableCell>
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
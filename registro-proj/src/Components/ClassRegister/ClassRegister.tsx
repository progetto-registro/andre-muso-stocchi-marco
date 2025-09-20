import { useEffect, useState } from "react";
import TableRegister from "./TableRegister";
import axios from "axios";
import { Box, Container } from "@mui/material";

export default function ClassRegister() {
   const [lezioni, setLezioni] = useState<any>(null);
  useEffect(() => {
    axios.get("https://68ce923d6dc3f350777f648e.mockapi.io/Lezioni") // indirizzo da mettere http://localhost:8080/api/lezioni
    .then(res=>{
        console.log(res.data)
        setLezioni(res.data);
        
    })
    .catch(res=>{
        console.log(res)
    })
    



  },[]);





 return(
 <>
  <Box  sx={{
        fontFamily: 'Roboto',
        position: "fixed", 
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
         display: "flex",
        placeItems: "center",
    backgroundColor: 'lightblue',}} >
       <Container
        maxWidth="sm" 
        sx={{
            transform:"scale(1.10)",
            transformOrigin:"center center",
            
        }}
        
       
      >
  <TableRegister lezioni={lezioni}></TableRegister>
  </Container>
  </Box>
</>      
         
 )        
}

import type { Studente } from "./Studente";

  export type Lezione = {
  id: number;
  
  dataLezione: Date;
   studenti: Studente[];
   studenteDaModificare: Studente | undefined;
}

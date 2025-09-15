//String o Number con maiuscola sono oggettti e non primitivi.. input etc usano primitivi e non torna niente; di default usare primitivi in type se non per motivi ignoti
export type User = {
  nome: string;
  cognome: string;
  mail: string;
  sesso: "M" | "F"; //anche minuscole ok nel backend fa toUpper
  dataNascita: string; // al backend la mandiamo in stringa quindi il tipo usato per la req mettiamo stirnga
  cf: string;
  password: string;
  username: string;
};

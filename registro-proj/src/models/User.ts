import type { Dayjs } from "dayjs";
//String o Number con maiuscola sono oggettti e non primitivi.. input etc usano primitivi e non torna niente; di default usare primitivi in type se non per motivi ignoti
export type User = {
  name: string;
  surname: string;
  email: string;
  gender: string;
  birthDate: Dayjs;
  cf: string;
  password: string;
};

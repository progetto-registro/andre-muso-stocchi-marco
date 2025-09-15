export  type FormSettings = {
  visible: string[]; // nomi dei  campi visible
  immutabile: string[]; // valori che non potranno essere cambiati
  // nomiEtichette: {name: string}[];
  textButton: string;
}

// name, surname , cf, date, password, oldPassword, confirmPassword, gender, email



// const set1: FormSettings={
//     visible: [] // tutti tranne oldPassword e confirmPassword
//     immutable:["name", ".."] //tutti 
//      textButton: "Modifica"
// }

// const set2: FormSettings={
//     visible: [] // tutti tranne oldPassword e confirmPassword
//     immutable:[] //tutti 
//     textButton: "Invia Modifiche"
// }
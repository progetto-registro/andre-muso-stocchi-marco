import { useState } from "react";
import axios, { Axios } from "axios";
export default function SignupPage(props:any) {
  // nell handler del submit quando poi lo fai mettici anche l istruzione  props.onSignup() . E' una callback che in App.tsx setta lo stato globale a loggato e fa funzionare rounting
  
      const [formData, setFormData] = useState({name: "",email: "",surname: "",gender:"",age:0,cf:""});

       const handleChange = (event:any) => 
        {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
      };

       const handleSubmit = (event:any) => 
        {
          event.preventDefault();
          props.onSignup();
          axios.post('https://jsonplaceholder.typicode.com/posts',{formData}) //API che simula un server post non scrivere comunque dati personali
          .then(function (response) 
          {
             console.log(response);
          })
          .catch(function (error) 
          {
              console.log(error);
          });
        };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Nome:</label>
      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}/>

      <label htmlFor="surname">Cognome:</label>
      <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange}/>

       <label htmlFor="age">Età:</label>
      <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="18" />

      <label htmlFor="email">Email:</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}/>

      <label htmlFor="cf">Codice Fiscale:</label>
      <input type="text" id="cf" name="cf" value={formData.cf} onChange={handleChange}  required  maxLength={16}/>

      
      <select name="gender" id="gender" value={formData.gender} onChange={handleChange}> 
          <option value="male">Maschio</option>
          <option value="female">Femmina</option>
        </select>
      <br></br>
      <button type="submit">Submit</button>
    </form>
  );
}

//leggere commenti in LogginPage che molte cose sono in comune

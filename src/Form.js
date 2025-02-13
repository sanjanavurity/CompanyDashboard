import './App.css';
import {Login} from "./Login";
import { Register } from './Register';
import { useState } from 'react';


export const Form = (props) => {
  const [currentForm, setCurrentForm] = useState('login')

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  
  return (
    <div>
      {
        currentForm==="login" ? <Login isLoggedIn={props.isLoggedIn} onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
      }
    </div>
  );
}
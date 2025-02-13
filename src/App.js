import React from 'react';
import { useState } from 'react';
import './App.css';
import {Form} from './Form'
import {Dashboard} from './dashboard'

function App() {
  const[loggedIn, setLoggedIn] = useState(false);

  const userLoggedIn = (value) => {
    setLoggedIn(value);
  }
  return (
    <div className="App">
      {
        loggedIn ? (<div className='Dashboard'><Dashboard/></div>) : (<div className='Form'><Form isLoggedIn={userLoggedIn}/></div>)
      }
    </div>
  );
}
export default App;
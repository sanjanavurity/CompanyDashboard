//import { props} from "react";
import { Home } from './home';
import { Department } from './Department';
import { Employee } from './Employee';
import {BrowserRouter, Route, Routes, NavLink} from 'react-router-dom';

export const Dashboard = () =>  {
  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className='d-flex justify-content-center m-3'>
      Dashboard
      </h3>
      <nav className='navbar navbar-expand-sm bg-light navbar-dark'>
        <ul className='navbar-nav'>
          <li className='nav-item m-1'>
            <NavLink className='btn btn-light btn-outline-primary' to='/home'>
              Home
            </NavLink>
          </li>
          <li className='nav-item m-1'>
            <NavLink className='btn btn-light btn-outline-primary' to='/department'>
              Department
            </NavLink>
          </li>
          <li className='nav-item m-1'>
            <NavLink className='btn btn-light btn-outline-primary' to='/employee'>
              Employee
            </NavLink>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path='/home' Component={Home}/>
        <Route path='/department' Component={Department}/>
        <Route path='/employee' Component={Employee}/>
      </Routes>
    </div>
    <button onClick={() => window.location.href = "./Login.jsx"}>Logout</button>
    </BrowserRouter>
  );
}
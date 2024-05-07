import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/pages/Home';
import Client from './components/pages/Client';
import EditClientPage from './components/EditClientPage';
import FormClient from './components/FormClient'; // Importez le composant FormClient ici
import Facturation from './components/Facturation';
import FacturationTable from './components/FacturationForm';
import Login from './auth/Login';
import Register from './auth/Register';
import Consulter from './components/Consulter';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path='/auth/login' element= {<Login />} />
          <Route path="/client" element={<Client />} />
          <Route path="/client/:id/edit" element={<EditClientPage />} />
          <Route path="/client/create" element={<FormClient />} /> 
          <Route path='/fact' element={<Facturation />} />
          <Route path='/facturation' element={<FacturationTable/>}/>
          <Route path='/consulter/:id' element={<Consulter/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;

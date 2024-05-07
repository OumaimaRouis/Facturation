import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [info, setInfo] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value, // Correction ici
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (info.password !== info.repeatPassword) {
        setErrors({ passwordMatch: 'Passwords do not match.' });
        return;
      }
      const response = await axios.post('http://localhost:3000/api/register', info);
      console.log("response", response.data);
      if (response.status === 201) // Correction ici
        navigate('../auth/login');
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.msg) {
        setErrors({ server: 'An error occurred. Please try again later.' });
      }
    }
  };

  return (
    <>
      <main className="m-5 p-5 md:max-w-xl md:mx-auto lg:max-w-2xl xl:max-w-4xl bg-white rounded shadow">
        <div className="flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="md:grid grid-cols-1 gap-10">
            <div className="flex flex-col">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Nom d'utilisateur"
                autoComplete="off"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label>Votre Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Votre email"
                autoComplete="off"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label>Mot de passe</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Mot de passe"
                autoComplete="off"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label >Répéter le mot de passe</label>
              <input
                type="password"
                name="repeatPassword"
                id="repeatPassword"
                placeholder="Répéter le mot de passe"
                autoComplete="off"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 font-bold py-2 px-8 rounded shadow border-2 border-yellow-500 
              hover:bg-transparent hover:text-yellow-500 
              transition-all duration-300"
            >
              Register
            </button>
            {errors.server && <p className='error'>{errors.server}</p>} {/* Correction ici */}
          </form>
        </div>
      </main>
    </>
  )
}

export default Register;

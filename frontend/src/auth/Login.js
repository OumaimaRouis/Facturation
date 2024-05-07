import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
const [info, setInfo] = useState({});
const [errors, setErrors] = useState({});
const navigate = useNavigate();

const handleChange = (e) => {
    setInfo({
        ...info,
        [e.target.name]: e.target.value,
    });
};

const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3000/api/login', info);

        if (response) {
            localStorage.setItem('token', response.data.result.token);
            localStorage.setItem('isAuth', true)
            navigate('/');
        } else {
            console.log('bad request');
        }
        return response;
    } catch (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message){
            setErrors({server: error.response.data.message});
        } else {
            setErrors({ server: 'An error occured. Please try again later.'});
        }
    }
};


    return (
        <>
        <main className="m-5 p-5 md:max-w-xl md:mx-auto lg:max-w-2xl xl:max-w-4xl bg-white rounded shadow">
        <div className="flex flex-col justify-center">
          <form action='/login' method="post" className="md:grid grid-cols-1 gap-10">
            

            <div className="flex flex-col">
              <label htmlFor="email">Votre Email</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Votre email"
                autoComplete="off"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Mot de passe</label>
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

            

            <button
              type="submit" onClick={handleSubmit}
              className="bg-yellow-500 font-bold py-2 px-8 rounded shadow border-2 border-yellow-500 
              hover:bg-transparent hover:text-yellow-500 
              transition-all duration-300"
            >
              Login in
            </button>
            {errors.server && <p className='error'>{errors.server}</p>} 
          </form>
        </div>
      </main>
    </>
  )
}


export default Login;
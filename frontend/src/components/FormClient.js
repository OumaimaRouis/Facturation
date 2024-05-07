import React, { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FormClient(){
  const navigate = useNavigate();


  const [newClient, setNewClient] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });

 
  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/clients", newClient);
      navigate('/client');
    } catch(error){
      console.error("Error creating clients:", error);
    }
  }

  return (
    <>
      <main className="m-5 p-5 md:max-w-xl md:mx-auto lg:max-w-2xl xl:max-w-4xl bg-white rounded shadow">
        <div className="flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="md:grid grid-cols-1 gap-10">
            <div className="flex flex-col">
              <label htmlFor="name">Votre Nom</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Votre nom"
                autoComplete="off"
                value={newClient.name}
                onChange={handleChange}
                required
              />
    
            </div>

            <div className="flex flex-col">
              <label htmlFor="address">Votre Adresse</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Votre adresse"
                autoComplete="off"
                value={newClient.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email">Votre Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Votre email"
                autoComplete="off"
                value={newClient.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone">Votre Téléphone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Votre téléphone"
                autoComplete="off"
                value={newClient.phone}
                onChange={handleChange}
                required
              />
            </div>

            <button onClick={handleSubmit}
  type="submit"
  className="bg-yellow-500 font-bold py-2 px-8 rounded shadow border-2 border-yellow-500 
  hover:bg-transparent hover:text-yellow-500 
  transition-all duration-300"
>
  Ajouter Client
</button>



          </form>

          
        </div>
      </main>
    </>
  );
}
export default FormClient;
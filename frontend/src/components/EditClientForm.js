import React, { useState, useEffect } from "react";

function ClientForm({ onSubmit, clientData }) {
  const [formData, setFormData] = useState({
    name: "",
  address: "",
  email: "",
  phone: ""
  });

  useEffect(() => {
    if (clientData) {
      setFormData(clientData); // Si des données de client sont fournies, les définir dans le formulaire
    }
  }, [clientData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData); // Envoyer les données du formulaire au gestionnaire de soumission
    } catch (error) {
        console.error("Error creating client:", error);
        alert("Une erreur s'est produite lors de l'ajout du client. Veuillez réessayer."); // Affichage d'une alerte en cas d'erreur
      }
  };

  return (
    <form onSubmit={handleSubmit} className="md:grid grid-cols-1 gap-10">
      <div className="flex flex-col">
        <label htmlFor="name">Nom</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Nom"
          autoComplete="off"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="address">Adresse</label>
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Adresse"
          autoComplete="off"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          autoComplete="off"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="phone">Téléphone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="Téléphone"
          autoComplete="off"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="bg-yellow-500 font-bold py-2 px-8 rounded shadow border-2 border-yellow-500 
        hover:bg-transparent hover:text-yellow-500 
        transition-all duration-300"
      >
        Enregistrer
      </button>
    </form>
  );
}

export default ClientForm;

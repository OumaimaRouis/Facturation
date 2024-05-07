import React, { useState, useEffect } from "react";
import axios from "axios";
import './ClientTable.css';
import { Link, useNavigate } from "react-router-dom";

function ClientTable() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [deletedClientName, setDeletedClientName] = useState("");


  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clients");
      const sortedClients = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setClients(sortedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleEdit = (clientId) => {
    // Redirect to edit client page
    navigate(`/client/${clientId}/edit`);
  };

  const handleDelete = async (clientId, clientName) => {
    try {
      await axios.delete(`http://localhost:3000/api/clients/${clientId}`);
      fetchClients();
      setDeletedClientName(clientName);
      setDeleteMsg(true);
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleInvoice = (clientName, clientAddress) => {
    // Pass the selected client data to the facturation page
    navigate("/fact", { state: { clientName, clientAddress } });
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4">Liste des Clients</h2>
        
    <button className="bg-blue-500 font-bold py-2 px-8 rounded shadow border-2 border-blue-500 
                      hover:bg-transparent hover:text-blue-500 
                      transition-all duration-300 text-left"><Link to='/client/create'>Ajouter Client</Link></button>
 
        {deleteMsg && 
        <div style={{backgroundColor: '#34cd60', color: '#fff', padding:'10px', borderRadius: '5px'}}>
          Le Client {deletedClientName} est supprimé avec succès
        </div>}

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Adresse</th>
                <th className="px-4 py-2">Téléphone</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border px-4 py-2">{client.name}</td>
                  <td className="border px-4 py-2">{client.email}</td>
                  <td className="border px-4 py-2">{client.address}</td>
                  <td className="border px-4 py-2">{client.phone}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => handleEdit(client.id)} 
                      className="bg-green-500 font-bold py-2 px-8 rounded shadow border-2 border-green-500 
                      hover:bg-transparent hover:text-green-500 
                      transition-all duration-300"
                    >
                      Modifier
                    </button>
                    <button onClick={() => handleDelete(client.id, client.name)} className="bg-red-500 font-bold py-2 px-8 rounded shadow border-2 border-red-500 
                      hover:bg-transparent hover:text-red-500 
                      transition-all duration-300">
                      Supprimer
                    </button>
                    <button onClick={() => handleInvoice(client.name, client.address)} className="bg-yellow-500 font-bold py-2 px-8 rounded shadow border-2 border-yellow-500 
                      hover:bg-transparent hover:text-yellow-500 
                      transition-all duration-300">
                      Facture
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default ClientTable;

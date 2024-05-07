import React, { useState, useEffect } from "react";
import axios from "axios";
import EditClientForm from "./EditClientForm";
import { useNavigate, useParams } from "react-router-dom";

function EditClientPage() {
  const [editingClient, setEditingClient] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/clients/${id}`);
        setEditingClient(response.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [id]);

  const handleEditSubmit = async (formData) => {
    try {
      await axios.put(`http://localhost:3000/api/clients/${editingClient.id}`, formData);
      
      // Rediriger vers la page ClientTable après avoir enregistré les modifications
      navigate("/client");
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-4">Modifier Client</h2>
      {editingClient && <EditClientForm onSubmit={handleEditSubmit} clientData={editingClient} />}
    </div>
  );
}

export default EditClientPage;

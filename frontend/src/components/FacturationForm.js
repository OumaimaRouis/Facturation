import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

function FacturationTable() {

  const navigate = useNavigate();

  const [facturations, setFacturations] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [deletedFacturationId, setDeletedFacturationId] = useState("");

  useEffect(() => {
    fetchFacturations();
  }, []);

  const handleViewInvoice = async (idInvoice) => {
    try {
        navigate(`/consulter/${idInvoice}`);
    } catch (error) {
        console.error("Error viewing invoice:", error);
    }
  };

  const fetchFacturations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/fact");
      const facturationsWithArticleDetails = await Promise.all(response.data.map(async (facturation) => {
        const articles = await fetchArticleDetails(facturation.articles);
        const clientId = facturation.client;
        const clientResponse = await axios.get(`http://localhost:3000/api/client/${clientId}`);
        const clientName = clientResponse.data.name;
        return { ...facturation, client: clientName, articles };
      }));
      const sortedFacturations = facturationsWithArticleDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      
      setFacturations(sortedFacturations);
    } catch (error) {
      console.error("Error fetching facturations:", error);
    }
  };

  const handleDelete = async (facturationId) => {
    try {
      await axios.delete(`http://localhost:3000/api/fact/${facturationId}`);
      fetchFacturations();
      setDeletedFacturationId(facturationId);
      setDeleteMsg(true);
    } catch (error) {
      console.error("Error deleting facturation:", error);
    }
  };

  const fetchArticleDetails = async (articleIds) => {
    try {
      const articles = await Promise.all(articleIds.map(async (articleId) => {
        const response = await axios.get(`http://localhost:3000/api/article/${articleId}`);
        return response.data;
      }));
      return articles;
    } catch (error) {
      console.error("Error fetching article details:", error);
      return [];
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4">Liste des Facturations</h2>
        
        {deleteMsg && 
        <div style={{backgroundColor: '#34cd60', color: '#fff', padding:'10px', borderRadius: '5px'}}>
          La facturation avec l'ID {deletedFacturationId} a été supprimée avec succès
        </div>}

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-300">
                <th className="px-4 py-2">Numéro Facture</th>
                <th className="px-4 py-2">Date Facture</th>
                <th className="px-4 py-2">Client</th>
                <th className="px-4 py-2">Articles</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              
            {facturations.map((facturation, index) => (
              <tr key={facturation.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border px-4 py-2">{facturation.numeroFacture}</td>
                <td className="border px-4 py-2">{new Date(facturation.dateFacture).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{facturation.client}</td>
                <td className="border px-4 py-2">
                  <ul>
                    {facturation.articles.map((article, idx) => (
                      <li key={idx}>{article.reference}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDelete(facturation.id)} className="text-red-500 hover:text-red-700">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="text-red-500 hover:text-red-700"  onClick={() => handleViewInvoice(facturation.id)}>
                    <FontAwesomeIcon icon={faEye} />
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

export default FacturationTable;

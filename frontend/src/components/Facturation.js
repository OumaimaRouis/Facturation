import React, { useState, useEffect } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';


function Facturation(props) {
   
    const location = useLocation();
    const state = location.state || {};
    const { clientName, clientAddress } = state;
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [numberInvoice, setNumberInvoice] = useState("");
    const [total, setTotal] = useState(0);

    const handleDeleteArticle = (index) => {
        setInvoiceItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems.splice(index, 1);
            return updatedItems;
        });
    };

    
    
    const handlePrint = () => {
        window.print()
      }

      const getClientId = async (clientName) => {
        try {
           
            const response = await axios.get(`http://localhost:3000/api/clients/search/${clientName}`);
            const client = response.data;
            if (client && client.id) { // Modification ici
                return client.id; // Modification ici
            } else {
                throw new Error("Client ID not found in response data");
            }
        } catch (error) {
            console.error("Error fetching client ID:", error);
            throw error;
        }
    };
    
    const handleArchive = async () => {
        try {
            const clientId = await getClientId(clientName);
            calculateTotal();
            const data = {
                numeroFacture: parseInt(numberInvoice),
                dateFacture: new Date().toISOString().slice(0, 10),
                client: clientId,
                articles: invoiceItems.map(item => ({
                    article: item.id, // Reference the article ID
                    quantity: item.quantity, // Include quantity
                    price: item.price, // Include price
                })),
                amount:  invoiceItems.map(item => item.amount),
                totalAmount:total,
                
            };
            console.log("Données à envoyer à l'API de création de facturation :", data);

    
            // Vérifier la disponibilité des quantités d'articles
            const availabilityPromises = invoiceItems.map(async item => {
                const response = await axios.get(`http://localhost:3000/api/article/${item.id}`);
                const article = response.data;
                console.log("Réponse de la requête :", response.data);
    
                if (article && article.quantite >= item.quantity) {
                    return true;
                } else {    
                    return false;
                }
            });
    
            const availabilities = await Promise.all(availabilityPromises);
    
            // Vérifier si toutes les quantités d'articles sont disponibles
            if (availabilities.every(avail => avail === true)) {
                // Mettre à jour les quantités des articles dans la base de données
                await Promise.all(invoiceItems.map(async item => {
                    const response = await axios.get(`http://localhost:3000/api/article/${item.id}`);
                    const article = response.data;
    
                    if (article && article.quantite >= item.quantity) {
                        const updatedQuantity = article.quantite - item.quantity;
                        await axios.put(`http://localhost:3000/api/article/${item.id}`, { quantite: updatedQuantity });
                    } else {
                        throw new Error(`Article with ID ${item.id} does not have sufficient quantity`);
                    }
                }));
    
                // Archiver la facture une fois que les quantités sont mises à jour
                await axios.post("http://localhost:3000/api/fact", data);
                navigate('/facturation');

            } else {
                // Afficher une alerte si certaines quantités d'articles ne sont pas disponibles
                alert("Certaines quantités d'articles ne sont pas disponibles.");
            }
        } catch (error) {
            console.error("Error archiving invoice:", error);
        }
    };
    
    
    
    
    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        // Recalculate total whenever invoiceItems changes
        calculateTotal();
    }, [invoiceItems]);

    const fetchArticles = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/article");
            setArticles(response.data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    const addArticle = () => {
        const selectedArticleObj = articles.find(article => article.id === selectedArticle);
        if (selectedArticleObj) {
            const newItem = {
                id: selectedArticleObj.id,
                description: selectedArticleObj.reference,
                quantity: selectedQuantity,
                price: selectedArticleObj.prix,
                amount: selectedQuantity * selectedArticleObj.prix,
            };
            setInvoiceItems(prevItems => [...prevItems, newItem]);
        }
    };
    

    const calculateTotal = () => {
        const totalAmount = invoiceItems.reduce((total, item) => total + item.amount, 0);
        setTotal(totalAmount);
    };


    return (
        <>
            <main className="m-5 p-5 md:max-w-xl md:mx-auto lg:max-w-2xl xl:max-w-4xl bg-white rounded shadow">
                <div className="invoice__preview bg-white p-5 rounded-2xl border-4 border-blue-200">
                <ul className="flex items-center justify-between flex-wrap">
    <li>
        <button
            onClick={handlePrint}
            className="bg-gray-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-gray-500 hover:bg-transparent hover:text-gray-500 transition-all duration-300"
        >
            Print
        </button>
    </li>
    <li className="mx-2">
        <button className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300">
            Download
        </button>
    </li>
</ul>
                    <div  className="p-5">
                        <header className="flex flex-col items-center justify-center mb-5 xl:flex-row xl:justify-between">
                            <div>
                                <h1 className="font-bold uppercase tracking-wide text-4xl mb-3">
                                    Facture
                                </h1>
                            </div>
                        </header>
                        <section className="flex flex-col items-end justify-end">
                            <h2 className="font-bold text-3xl uppercase mb-1">LIMIMA</h2>
                            <p>Msaken Sousse</p>
                        </section>
                        <section className="mt-10">
                            <h2 className="text-2xl uppercase font-bold mb-1">{clientName}</h2>
                            <p>{clientAddress}</p>
                        </section>
                        <article className="mt-10 mb-14 flex items-end justify-end">
                            <ul>
                                <li className="p-1">
                                    <span className="font-bold">Le nombre de Facture:</span> 
                                    <input
                                        type="text"
                                        value={numberInvoice}
                                        onChange={(e) => setNumberInvoice(e.target.value)}
                                        placeholder="Saisissez le nombre de facture"
                                    />
                                </li>
                                <li className="p-1 bg-gray-100">
                                    <span className="font-bold">La Date du Facture:</span> {new Date().toISOString().slice(0,10)}
                                </li>
                            </ul>
                        </article>
                        <div className="flex items-center mb-4">
                            <label className="mr-4">Choisir un article:</label>
                            <select
                                value={selectedArticle}
                                onChange={(e) => setSelectedArticle(e.target.value)}
                                className="mr-4"
                            >
                                <option value="">Sélectionnez un article</option>
                                {articles.map(article => (
                                    <option key={article.id} value={article.id}>{article.reference}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={selectedQuantity}
                                onChange={(e) => setSelectedQuantity(e.target.value)}
                                placeholder="Quantité"
                            />
                            <button onClick={addArticle} className="bg-blue-500 text-white font-bold py-2 px-4 rounded ml-4">
                                Ajouter
                            </button>
                        </div>
                        <table className="w-full mb-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Quantité</th>
                                    <th className="px-4 py-2">Prix</th>
                                    <th className="px-4 py-2">Montant</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.description}</td>
                                        <td className="border px-4 py-2">{item.quantity}</td>
                                        <td className="border px-4 py-2">{item.price}</td>
                                        <td className="border px-4 py-2">{item.amount}</td>
                                        <td className="border px-4 py-2">
                                <button onClick={() => handleDeleteArticle(index)} className="text-red-500 hover:text-red-700">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
                            Total {total.toLocaleString()} Dt
                        </h2>
                        <button onClick={handleArchive} className="bg-green-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-green-500 hover:bg-transparent hover:text-green-500 transition-all duration-300">
            Archiver
        </button>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Facturation;

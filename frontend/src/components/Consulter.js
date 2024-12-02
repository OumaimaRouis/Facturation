import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Consulter(props) {

    const { id } = useParams();
    const [invoice, setFacturations] = useState([]);


    const handlePrint = () => {
        window.print()
      }

      useEffect(() => {
        const fetchInvoiceData = async () => {
          try {
            let articles = [];
            let response = await axios.get(`http://localhost:3000/api/fact/${id}`);
            console.log(response.data);
            const clientId = response.data.client;
            const clientResponse = await axios.get(`http://localhost:3000/api/client/${clientId}`);
            response.data.name = clientResponse.data.name;
            response.data.address = clientResponse.data.address; 
            await Promise.all(response.data.articles.map(async (item, index) => {
                const responseArticle = await axios.get(`http://localhost:3000/api/article/${item.article}`);
                const article = responseArticle.data;
                article.quantite = response.data.articles[index].quantite;
                articles.push(article);
            }));
            console.log("tesst",response.data.articles)
            response.data.articles = articles;
            console.log(response.data)
            setFacturations(response.data);

          } catch (error) {
            console.error("Error fetching client data:", error);
          }
        };
    
        fetchInvoiceData();
      }, [id]);
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
                            <h2 className="text-2xl uppercase font-bold mb-1">{invoice.name}</h2>
                            <p>{invoice.address}</p>
                        </section>
                        <article className="mt-10 mb-14 flex items-end justify-end">
                            <ul>
                                <li className="p-1">
                                    <span className="font-bold">Le nombre de Facture:</span> 
                                    <input
                                        type="text"
                                        value={invoice.numeroFacture}
                                        placeholder="Saisissez le nombre de facture"
                                    />
                                </li>
                                <li className="p-1 bg-gray-100">
                                    <span className="font-bold">La Date du Facture:</span> {invoice.dateFacture && new Date(invoice.dateFacture).toISOString().slice(0,10)}
                                </li>
                            </ul>
                        </article>
                       
                        <table className="w-full mb-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Quantité</th>
                                    <th className="px-4 py-2">Prix</th>
                                    <th className="px-4 py-2">Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invoice && invoice.articles && invoice.articles.map((item, index) => (
    <tr key={index}>
        <td className="border px-4 py-2">{item.reference}</td>
        <td className="border px-4 py-2">{invoice.articles[index].quantite}</td>
        <td className="border px-4 py-2">{item.prix}</td>
        <td className="border px-4 py-2">
            {Array.isArray(invoice.amount) ? invoice.amount[index] : "N/A"}
        </td>        
    </tr>
))}
</tbody>
                        </table>
                        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
                            Total {invoice.totalAmount} Dt
                        </h2>
                        <section className="mt-10">
    <p>Cacher et Signature</p>
</section>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Consulter;


// ArticleTable.js
import React from "react";

const ArticleTable = ({ articles, onSelect }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Reference</th>
          <th>Price</th>
          <th>Quantity</th>
          {/* Add other columns as needed */}
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.id} onClick={() => onSelect(article)}>
            <td>{article.reference}</td>
            <td>{article.price}</td>
            <td>{article.quantity}</td>
            {/* Render other article details */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArticleTable;

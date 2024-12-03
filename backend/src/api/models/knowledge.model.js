const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Se connecter', 'Facture'
});

module.exports = mongoose.model('Knowledge', KnowledgeSchema);

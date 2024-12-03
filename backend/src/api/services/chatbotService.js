const natural = require('natural'); // NLP utilities
const TfIdf = natural.TfIdf;
const Knowledge = require('../models/knowledge.model');
const { NlpManager } = require('node-nlp'); // For NER

// NLP Manager for NER
const nlpManager = new NlpManager({ languages: ['fr'] });

// Helper to preprocess text (lowercase, tokenize, stem)
const preprocessText = (text) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());
  return tokens.map((token) => natural.PorterStemmer.stem(token)).join(' ');
};

// Extract keywords using NER
const extractKeywords = async (text) => {
  const response = await nlpManager.process('fr', text);
  const entities = response.entities.map((entity) => entity.option.toLowerCase());
  return entities.length > 0 ? entities : text.split(' '); // Fallback to splitting by space
};

// Find the best match using TF-IDF
const findBestMatch = (knowledgeBase, processedInput) => {
  const tfidf = new TfIdf();

  // Add knowledge base questions to the TF-IDF model
  knowledgeBase.forEach((entry) => {
    tfidf.addDocument(preprocessText(entry.question));
  });

  let highestScore = 0;
  let bestMatchIndex = -1;

  // Calculate similarity scores
  tfidf.tfidfs(processedInput, (i, measure) => {
    if (measure > highestScore) {
      highestScore = measure;
      bestMatchIndex = i;
    }
  });

  return highestScore > 0.5 ? knowledgeBase[bestMatchIndex] : null; // Threshold of 0.5
};

// Main service function
exports.processUserInput = async (userInput) => {
    try {
      const knowledgeBase = await Knowledge.find();
  
      if (!knowledgeBase || knowledgeBase.length === 0) {
        return {
          answer: "Désolé, je n'ai aucune information dans ma base de connaissances.",
          suggestions: [],
        };
      }
  
      // Extract keywords from user input
      const keywords = await extractKeywords(userInput);
      const processedInput = preprocessText(keywords.join(' '));
  
      // Find the best match
      const bestMatch = findBestMatch(knowledgeBase, processedInput);
  
      const suggestions = knowledgeBase
        .filter((entry) => entry.category === (bestMatch?.category || ''))
        .map((entry) => entry.question);
  
      return {
        answer: bestMatch
          ? bestMatch.answer
          : 'Désolé, je ne connais pas la réponse à cette question.',
        suggestions: suggestions.slice(0, 5), // Limit suggestions to 5
      };
    } catch (error) {
      console.error('Error in processUserInput:', error);
      return {
        answer: "Une erreur s'est produite. Veuillez réessayer.",
        suggestions: [],
      };
    }
  };
  

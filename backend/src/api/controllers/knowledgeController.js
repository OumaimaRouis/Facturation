const Knowledge = require('../models/knowledge.model');

exports.addKnowledge = async (req, res) => {
    try {
      const { question, answer, category } = req.body;
      const knowledge = new Knowledge({ question, answer, category });
      await knowledge.save();
      res.status(201).json({ message: 'Knowledge added successfully', knowledge });
    } catch (error) {
      res.status(500).json({ message: 'Error adding knowledge', error });
    }
  };
  
  exports.getKnowledgeByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const knowledge = await Knowledge.find({ category });
      res.status(200).json(knowledge);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching knowledge', error });
    }
  };
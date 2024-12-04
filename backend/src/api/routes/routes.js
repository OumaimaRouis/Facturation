module.exports = app =>{
    const router = require('express').Router();
    const clientController= require('../controllers/client.controller');
    const articleController= require('../controllers/article.controller');
    const userController= require('../controllers/users.controller');
    const factController= require('../controllers/facturation.controller');
    const knowledgeController= require('../controllers/knowledgeController');
    const chatbotService= require('../services/chatbotService');
    
    router.post('/clients', clientController.create);
    router.get('/clients', clientController.findAll);
    router.get('/clients/:id', clientController.findOne);
    router.get('/client/:id', clientController.findName);
    router.get('/clients/search/:name', clientController.findByName);
    router.delete('/clients/:id', clientController.delete);
    router.put('/clients/:id', clientController.update);

    router.post('/article', articleController.create);
    router.get('/article', articleController.findAll);
    router.get('/article/:id', articleController.findOne);
    router.put('/article/:id', articleController.update);


    router.post('/register', userController.registerUser);
    router.post('/login', userController.loginUser);

    router.post('/fact', factController.create);
    router.get('/fact', factController.findAll);
    router.get('/fact/:id', factController.findOne);
    router.delete('/fact/:id', factController.delete);
    router.put('/fact/:id', factController.update);

    router.post('/know',knowledgeController.addKnowledge);
    router.get('/cat/:cat',knowledgeController.getKnowledgeByCategory);

    router.post('/ask', async (req, res) => {
        try {
          const { userInput } = req.body;
          const response = await chatbotService.processUserInput(userInput);
          res.status(200).json({ response });
        } catch (error) {
          res.status(500).json({ message: 'Error processing chatbot request', error });
        }
      });

      app.post('/api/nlp/navigation', (req, res) => {
        const { text } = req.body;
      
        let intent = null;
        if (text.toLowerCase().includes('facture')) {
          intent = 'facture';
        } else if (text.toLowerCase().includes('client')) {
          intent = 'client';
        } else if (text.toLowerCase().includes('home') || text.toLowerCase().includes('accueil')) {
          intent = 'home';
        } else {
          intent = 'unknown';
        }
      
        res.json({ intent });
      });
  
  
     


    app.use('/api/', router);
}
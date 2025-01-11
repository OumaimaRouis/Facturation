module.exports = app =>{
    const router = require('express').Router();
    const promClient = require('prom-client');
    const clientController= require('../controllers/client.controller');
    const articleController= require('../controllers/article.controller');
    const userController= require('../controllers/users.controller');
    const factController= require('../controllers/facturation.controller');
    const knowledgeController= require('../controllers/knowledgeController');
    const chatbotService= require('../services/chatbotService');

    // Define Prometheus metrics
    const collectDefaultMetrics = promClient.collectDefaultMetrics;
    collectDefaultMetrics(); // Automatically collects default system metrics

    // Create custom metrics
    const httpRequestDurationMicroseconds = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Histogram of HTTP request durations in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5, 10] // Customizable buckets
  });

   // Middleware to track request durations
   router.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.originalUrl, status_code: res.statusCode });
    });
    next();
});
    
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

      // Expose /metrics endpoint for Prometheus scraping
    app.get('/metrics', async (req, res) => {
      try {
          res.set('Content-Type', promClient.register.contentType);
          res.end(await promClient.register.metrics());
      } catch (error) {
          res.status(500).json({ message: 'Error getting metrics', error });
      }
  });
  

    app.use('/api/', router);
}
module.exports = app =>{
    const router = require('express').Router();
    const clientController= require('../controllers/client.controller');
    const articleController= require('../controllers/article.controller');
    const userController= require('../controllers/users.controller');
    const factController= require('../controllers/facturation.controller');
    const detailArController= require('../controllers/detailAr.controller');

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

    router.post('/detail', detailArController.create);
    router.get('/detail', detailArController.findAll);
    router.get('/detail/:id', detailArController.findOne);


    router.post('/register', userController.registerUser);
    router.post('/login', userController.loginUser);

    router.post('/fact', factController.create);
    router.get('/fact', factController.findAll);
    router.get('/fact/:id', factController.findOne);
    router.delete('/fact/:id', factController.delete);
    router.put('/fact/:id', factController.update);



    app.use('/api/', router);
}
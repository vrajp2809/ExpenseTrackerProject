const routes = require('express').Router();
const tranTypeController = require('../controllers/TransactionTypeController');

routes.get('/tranTypes',tranTypeController.getAllTranTypes);
routes.post('/tranType',tranTypeController.createTrantype);


module.exports = routes;
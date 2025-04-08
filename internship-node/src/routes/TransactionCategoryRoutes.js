const routes = require('express').Router();
const TransactionCategoryController = require('../controllers/TransactionCategoryController');


routes.get('/tranCategories', TransactionCategoryController.getAllTranCategory);
routes.post('/addTranCategory', TransactionCategoryController.addTranCategory);
routes.get('/getTranCatByTranType/:TranTypeId', TransactionCategoryController.getTransactionCategoryByTransactionType);


module.exports = routes;
const routes = require('express').Router();
const AccountController = require('../controllers/AccountContoller');

routes.get('/accounts',AccountController.getAllAccounts);
routes.post('/account',AccountController.createAccount);
routes.delete('/account/:id',AccountController.deleteAccount);
routes.get('/account/:userId',AccountController.getAccountByUserId);

module.exports = routes;
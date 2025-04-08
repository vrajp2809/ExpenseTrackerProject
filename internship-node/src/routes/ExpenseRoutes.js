const routes = require('express').Router();
const expenseController = require('../controllers/ExpenseController');

routes.get('/expenses', expenseController.getAllExpenses);
routes.get('/expensebyid/:id', expenseController.expensedatabyid);
routes.get('/expense/:id', expenseController.getAllExpensesByLoggedinUser);
routes.post('/expenseWithoutAttachment', expenseController.addExpense);
routes.post('/expense', expenseController.addExpenseWithAttachment);
routes.delete('/deleteExpense/:id',expenseController.deleteExpenseById);
routes.get('/dashboard/:userId', expenseController.getDashboardData);



module.exports = routes;
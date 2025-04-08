const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

const userRoutes = require("./src/routes/UserRoutes")
app.use(userRoutes)

const AccountRoutes = require("./src/routes/AccountRoutes")
app.use(AccountRoutes)

const tranTypeRoutes = require('./src/routes/TranTypeRoutes')
app.use(tranTypeRoutes);

const tranCategoriesRoutes = require('./src/routes/TransactionCategoryRoutes');
app.use(tranCategoriesRoutes);

const expenseRoutes = require('./src/routes/ExpenseRoutes');
app.use(expenseRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/25_node_internship").then(()=>{
    console.log("database connected.......")
})







const PORT = 3000

app.listen(PORT , ()=>{
    console.log("server started on port number ",PORT)
})









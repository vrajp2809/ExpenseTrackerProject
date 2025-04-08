const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./TransactionCategoryModel');


const expenseSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    amountSpent: {
        type: Number,
        required: true
    },
    paidTo: {
        type: String,
        required: true
    },
    transactionDate:{
        type: Date,
        required: true,
    },
    accountId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'account'
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'TransactionCategories'
    },
    notes: {
        type: String,
        required: true
    },
    attachmentURL:{
        type: String
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('expense', expenseSchema)
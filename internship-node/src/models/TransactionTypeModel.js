const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionTypeSchema = new Schema({
    tranType:{
        type:String,
        enum:['income','expense'],
        required:true,
    }
})

module.exports = mongoose.model('tranTypeModel',transactionTypeSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TransactionCategoriesSchema = new Schema({
    category:{
        type: String,
        require: true,
        unique: true,
    },
    TranTypeId: {
        type: Schema.Types.ObjectId,
        ref: 'tranTypeModel', //Collection name
        required: true,
    },
    isTransaction: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('TransactionCategories', TransactionCategoriesSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'users',
    },
    title:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('account',accountSchema);
const tranTypeModel = require("../models/TransactionTypeModel");

const getAllTranTypes = async (req , res)=>{
    try{
        const foundTranTypes = await tranTypeModel.find();

        res.status(200).json({
            message:'Fetched all Transaction types successfully',
            data:foundTranTypes,
        })

    }catch(error)
    {
        res.status(500).json({
            message:'error fetching transaction types',
            error:error.message,
        })
    }
}


const createTrantype = async(req,res)=>{
    try{
        const createdTranType = await tranTypeModel.create(req.body);
        res.status(201).json({
            message:'Transaction Type Created Successfully.',
            data:createdTranType,
        })

    }catch(error)
    {
        res.status(500).json({
            message:'error creating transaction type',
            error:error.message,
        })
    }
}

module.exports = {
    getAllTranTypes,
    createTrantype,
}
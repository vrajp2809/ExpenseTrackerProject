const TransactionCategoryModel = require('../models/TransactionCategoryModel');

const getAllTranCategory = async(req,res)=>{
    try{
        const foundTranCategory = await TransactionCategoryModel.find().populate("TranTypeId");

        res.status(200).json({
            message:'Transaction Category fetched successfully',
            data:foundTranCategory,
        })

    }catch(error)
    {
        res.status(500).json({
            message:'Error in fetching transaction category',
            error:error.message,
        })
    }
}



const addTranCategory = async (req, res) => {
    try {
        const { category, TranTypeId } = req.body;

        // Check if category already exists
        const existingCategory = await TransactionCategoryModel.findOne({ category });
        if (existingCategory) {
            return res.status(400).json({
                message: "Transaction Category already exists",
            });
        }

        // Create new category
        const addedTransactionCategory = await TransactionCategoryModel.create({ category, TranTypeId });

        res.status(201).json({
            message: "Transaction Category Added successfully",
            data: addedTransactionCategory,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error in adding Transaction Category",
            error: error.message,
        });
    }
};


const getTransactionCategoryByTransactionType = async(req,res)=>{
    try{
        const foundTranCategoryByTranType = await TransactionCategoryModel.find({ TranTypeId:req.params.TranTypeId}).populate("TranTypeId")
        res.status(200).json({
            message:'Transaction Category found successfully by transaction type id',
            data:foundTranCategoryByTranType,
        })

    }catch(error)
    {
        res.status(500).json({
            message:'Error in fetching transaction Category by transaction type',
            error:error.message,
        })
    }
}


module.exports = {
    getAllTranCategory,getTransactionCategoryByTransactionType,addTranCategory

}
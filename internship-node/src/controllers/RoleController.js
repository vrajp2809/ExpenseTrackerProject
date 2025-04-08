const roleModel = require("../models/RoleModel");

const addRole = async (req,res)=>{
    
    const savedRole = await roleModel.create(req.body)


    res.json({
        message:"role created",
        data:savedRole,
    });
};

const deleteRole = async(req,res)=>{
    const deleteRole = await roleModel.findByIdAndDelete(req.params.id)

    res.json({
        message : "role deleted.........",
        data:deleteRole,
    })
}


const getRoleById = async (req,res)=>{
    const foundRole = await roleModel.findById(req.params.id)

    res.json({
        message:"Role fetched successfully ..........",
        data:foundRole
    })
}



module.exports = {
    addRole,getRoleById,deleteRole
}
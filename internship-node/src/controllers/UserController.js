const userModel = require("../models/UserModel")
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil")
const multer = require("multer");
const cloudinaryUtil = require('../utils/CloudinaryUtil');
//addUser
//getUser
//deleteUser
//getUserById



const loginUser = async (req , res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const foundUserFromEmail = await userModel.findOne({email : email}).populate("roleId");

    if(foundUserFromEmail != null)
    {
        const isMatch = bcrypt.compareSync(password , foundUserFromEmail.password);

        if(isMatch)
        {
            res.status(200).json({
                message : "login success",
                data:foundUserFromEmail,
            })
        }
        else{
            res.status(404).json({
                message:"invalid cred"
            })
        }
    }
    else
    {
        res.status(404).json({
            message:"Email not found",
        })
    }
}

const signup = async (req , res)=>{
    try{
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password,salt)
        req.body.password = hashedPassword;

        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const createdUser = await userModel.create(req.body);
        try {
            console.log("Sending email to:", createdUser.email);
            const mailResponse = await mailUtil.sendingMail(
                createdUser.email,
                "Welcome to Expense Tracker",
                "This is a Welcome Message"
            );
            console.log("Email sent successfully:", mailResponse);
        } catch (error) {
            console.error("Error sending mail:", error); // ✅ FIXED
        }

        res.status(201).json({
            message:"user created",
            data:createdUser,
        });
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"error",
            data:err,
        });
        
    }
}







const addUser = async (req , res)=>{
    const savedUser = await userModel.create(req.body)

    res.json({
        message:"User Created successfully....",
        data:savedUser
    })
}

const deleteUser = async (req , res )=>{
    const deletedUser = await userModel.findByIdAndDelete(req.params.id)

    res.json({
        message:"User Deleted Successfully......",
        data:deletedUser
    })
}

const getUserById = async (req , res)=>{
    const fountUser = await userModel.findById(req.params.id)

    res.json({
        message : "User Fetched successfully",
        data:fountUser
    })
}

const getAllUser = async (req , res )=>{
    const foundUser = await userModel.find()

    res.json({
        message : "Users fetched successfulyl",
        data:foundUser
    })
}


const storage = multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    },
});

const upload = multer({
    storage:storage
}).single("image");

const addUserWithProfile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }

        try {
            // Check if email already exists
            const existingUser = await userModel.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Hash the password before saving
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hashedPassword;

            // Upload image to Cloudinary
            const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
            req.body.imageURL = cloudinaryResponse.secure_url;

            // Create user with hashed password
            const newUser = await userModel.create(req.body);

            res.status(201).json({
                message: "User Added Successfully",
                data: newUser
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};



const updateUser = async (req, res) => {
    try {
        console.log("Received file:", req.file);  // Debugging: Log the uploaded file
        console.log("Received body:", req.body);  // Debugging: Log the request body

        const { id } = req.params;
        let updateData = { ...req.body };

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Check if an image file is uploaded
        if (req.file) {
            const cloudinaryResponse = await cloudinaryUtil.uploadUpdateFileToCloudinary(req.file);
            updateData.imageURL = cloudinaryResponse.secure_url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};


const deactivateUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await userModel.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User deactivated successfully", data: user });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  const activateUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await userModel.findByIdAndUpdate(
        id,
        { status: true },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "User activated successfully", data: user });
    } catch (error) {
      console.error("Error deactivating user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }


module.exports = {
    getAllUser,deleteUser,getUserById,addUser,signup,loginUser,addUserWithProfile,updateUser,deactivateUser,activateUser
}

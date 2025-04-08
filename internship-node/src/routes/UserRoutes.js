const routes = require("express").Router()
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory before uploading to Cloudinary



const userController = require("../controllers/UserController")
routes.put("/updateUser/:id", upload.single("image"), userController.updateUser);
routes.get("/users",userController.getAllUser)
routes.get("/user/:id",userController.getUserById)
routes.delete("/user/:id",userController.deleteUser)
routes.post("/user",userController.signup)
routes.post("/user/login",userController.loginUser)
routes.post("/addWithProfile", userController.addUserWithProfile);
routes.patch("/user/:id/deactivate", userController.deactivateUser);
routes.patch("/user/:id/activate", userController.activateUser);



module.exports = routes
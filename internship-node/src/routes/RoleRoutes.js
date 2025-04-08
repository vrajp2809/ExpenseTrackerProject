const routes = require("express").Router()

const roleController = require("../controllers/RoleController")

routes.post("/role",roleController.addRole)

routes.get("/roles/:id",roleController.getRoleById)
routes.delete("/role/:id",roleController.deleteRole)
module.exports = routes
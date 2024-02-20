import {Router} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {userValidation} from "../validators/user-validator";
import {userController} from "../composition-roots/user-composition";

export const userRoute = Router();

userRoute.get("/",authMiddleware, userController.getAllUsers.bind(userController))
userRoute.post("/", authMiddleware, userValidation(), userController.createUser.bind(userController))
userRoute.delete("/:id", authMiddleware, userController.deleteUser.bind(userController))
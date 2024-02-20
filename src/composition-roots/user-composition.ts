import {UserRepository} from "../repositories/user-repository";
import {UserService} from "../services/user-service";
import {UserController} from "../controllers/user-controller";
import {bcriptService, jwtService} from "./security-composition";

export const userRepository = new UserRepository(jwtService);
export const userService = new UserService(userRepository, jwtService, bcriptService);
export const userController = new UserController(userService);
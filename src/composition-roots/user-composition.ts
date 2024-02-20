import {UserRepository} from "../repositories/user-repository";
import {JwtService} from "../application/jwt-service";
import {BcriptService} from "../application/bcript-service";
import {UserService} from "../services/user-service";
import {UserController} from "../controllers/user-controller";

const jwtService = new JwtService();
const bcriptService = new BcriptService();
const userRepository = new UserRepository(jwtService);
export const userService = new UserService(userRepository, jwtService, bcriptService);
export const userController = new UserController(userService);
import "reflect-metadata";
import {UserRepository} from "../repositories/user-repository";
import {UserService} from "../services/user-service";
import {UserController} from "../controllers/user-controller";
import {Container} from "inversify";
import {BcriptService} from "../application/bcript-service";
import {JwtService} from "../application/jwt-service";

const userContainer = new Container();
userContainer.bind(BcriptService).to(BcriptService);
userContainer.bind(JwtService).to(JwtService);
userContainer.bind(UserRepository).to(UserRepository);
userContainer.bind(UserService).to(UserService);
userContainer.bind(UserController).to(UserController);

export const userService = userContainer.get(UserService);
export const userController = userContainer.get(UserController);
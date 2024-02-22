import "reflect-metadata";
import {AuthController} from "../controllers/auth-controller";
import {AuthService} from "../services/auth-service";
import {UserService} from "../services/user-service";
import {EmailService} from "../services/email-service";
import {Container} from "inversify";
import {UserRepository} from "../repositories/user-repository";
import {JwtService} from "../application/jwt-service";
import {BcriptService} from "../application/bcript-service";

const authContainer = new Container();
authContainer.bind(JwtService).to(JwtService);
authContainer.bind(BcriptService).to(BcriptService);
authContainer.bind(UserService).to(UserService);
authContainer.bind(EmailService).to(EmailService);
authContainer.bind(UserRepository).to(UserRepository);
authContainer.bind(AuthService).to(AuthService);
authContainer.bind(AuthController).to(AuthController);

export const authController = authContainer.get(AuthController);

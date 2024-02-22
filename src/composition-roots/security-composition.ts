import "reflect-metadata";
import {SecurityController} from "../controllers/security-controller";
import {JwtService} from "../application/jwt-service";
import {SecurityService} from "../services/security-service";
import {BcriptService} from "../application/bcript-service";
import {Container} from "inversify";
import {UserRepository} from "../repositories/user-repository";

const securityContainer = new Container();
securityContainer.bind(JwtService).to(JwtService);
securityContainer.bind(UserRepository).to(UserRepository);
securityContainer.bind(BcriptService).to(BcriptService);
securityContainer.bind(SecurityService).to(SecurityService);
securityContainer.bind(SecurityController).to(SecurityController);

export const jwtService = securityContainer.get(JwtService);
export const bcriptService = securityContainer.get(BcriptService);
export const securityService = securityContainer.get(SecurityService);
export const securityController = securityContainer.get(SecurityController);
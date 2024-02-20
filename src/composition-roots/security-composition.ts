import {SecurityController} from "../controllers/security-controller";
import {JwtService} from "../application/jwt-service";
import {SecurityService} from "../services/security-service";
import {BcriptService} from "../application/bcript-service";
import {userRepository} from "./user-composition";

export const jwtService = new JwtService();
export const bcriptService = new BcriptService();
export const securityService = new SecurityService(userRepository, jwtService);
export const securityController = new SecurityController(jwtService, securityService);
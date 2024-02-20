import {SecurityController} from "../controllers/security-controller";
import {JwtService} from "../application/jwt-service";
import {SecurityService} from "../services/security-service";
import {UserRepository} from "../repositories/user-repository";

export const jwtService = new JwtService();
const userRepository = new UserRepository(jwtService);
export const securityService = new SecurityService(userRepository, jwtService);
export const securityController = new SecurityController(jwtService, securityService);
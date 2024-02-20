import {AuthController} from "../controllers/auth-controller";
import {AuthService} from "../services/auth-service";
import {UserService} from "../services/user-service";
import {JwtService} from "../application/jwt-service";
import {BcriptService} from "../application/bcript-service";
import {UserRepository} from "../repositories/user-repository";
import {EmailService} from "../services/email-service";

const jwtService = new JwtService();
const bcriptService = new BcriptService();
const userRepository = new UserRepository(jwtService);
const userService = new UserService(userRepository, jwtService, bcriptService);
const emailService = new EmailService();
const authService = new AuthService(
    jwtService,
    userService,
    bcriptService,
    userRepository,
    emailService
);
export const authController = new AuthController(authService, userService);
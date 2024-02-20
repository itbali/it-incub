import {AuthController} from "../controllers/auth-controller";
import {AuthService} from "../services/auth-service";
import {UserService} from "../services/user-service";
import {EmailService} from "../services/email-service";
import {userRepository} from "./user-composition";
import {bcriptService, jwtService} from "./security-composition";

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
import {body} from "express-validator";

const loginValidator = body('login')
.trim().isLength({min: 3, max: 30}).matches(/^[a-zA-Z0-9_-]*$/).withMessage("Incorrect login");

const emailValidator = body('email').trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage("Incorrect email");

const passwordValidator = body('password').trim().isLength({min: 6, max: 20}).withMessage("Incorrect password");

export const userValidation = () => {
    return [loginValidator, emailValidator, passwordValidator];
}
import {body} from "express-validator";

const loginValidator = body('loginOrEmail').trim().isString().withMessage("Incorrect loginOrEmail");
const passwordValidator = body('password').trim().isString().withMessage("Incorrect password");

export const loginValidation = () => {
    return [loginValidator, passwordValidator];
}
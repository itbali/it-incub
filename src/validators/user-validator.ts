import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const loginValidator = body('login')
.trim().isString().not().isNumeric().isLength({min: 3, max: 30}).matches(/^[a-zA-Z0-9_-]*$/).withMessage("Incorrect login");

const emailValidator = body('email').trim().isEmail().withMessage("Incorrect email");

const passwordValidator = body('password').trim().isLength({min: 6, max: 20}).withMessage("Incorrect password");

export const userValidation = () => {
    return [loginValidator, emailValidator, passwordValidator, inputModelValidation];
}
import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

export const registerLoginValidator = body('login')
    .trim()
    .isLength({min: 3, max: 10})
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("Incorrect login")

export const registerEmailValidator = body('email')
    .trim()
    .isEmail()
    .withMessage("Incorrect email")

export const registerPasswordValidator = body('password')
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage("Incorrect password")

export const registerValidation = () => {
    return [registerLoginValidator, registerEmailValidator, registerPasswordValidator, inputModelValidation]
}
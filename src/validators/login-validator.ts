import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const loginValidator = body('loginOrEmail').trim().isString().not().isNumeric().isLength({min: 3, max: 30}).withMessage("Incorrect loginOrEmail");
const passwordValidator = body('password').trim().isString().isLength({min: 6, max: 20}).withMessage("Incorrect password");

export const loginValidation = () => {
    return [loginValidator, passwordValidator, inputModelValidation];
}
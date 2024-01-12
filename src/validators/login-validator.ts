import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const loginValidator = body('loginOrEmail').trim().isString().withMessage("Incorrect loginOrEmail");
const passwordValidator = body('password').trim().isString().withMessage("Incorrect password");

export const loginValidation = () => {
    return [loginValidator, passwordValidator, inputModelValidation];
}
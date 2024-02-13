import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const passwordValidator = body('newPassword')
    .trim()
    .isString()
    .isLength({min: 6, max: 20})
    .withMessage("Incorrect password");

const recoveryCodeValidator = body('recoveryCode')
    .isString()
    .isJWT()
    .withMessage("Incorrect recoveryCode");

export const newPasswordValidation = () => {
    return [passwordValidator, recoveryCodeValidator, inputModelValidation];
}
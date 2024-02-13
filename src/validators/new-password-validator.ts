import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import jwt from "jsonwebtoken";

const passwordValidator = body('newPassword')
    .trim()
    .isString()
    .isLength({min: 6, max: 20})
    .withMessage("Incorrect password");

const recoveryCodeValidator = body('recoveryCode')
    .isString()
    .isJWT()
    .custom((recoveryCode: string) => {
        jwt.verify(recoveryCode, process.env.SECRET_KEY as string);
    })
    .withMessage("Incorrect recoveryCode");

export const newPasswordValidation = () => {
    return [passwordValidator, recoveryCodeValidator, inputModelValidation];
}
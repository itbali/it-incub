import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {checkEmailJwtCode} from "./check-email-jwt-code";

const codeValidator = body('code')
    .trim()
    .isString()
    .custom(checkEmailJwtCode)
    .withMessage("Incorrect code");

export const emailConfirmationValidator = () => [codeValidator, inputModelValidation]
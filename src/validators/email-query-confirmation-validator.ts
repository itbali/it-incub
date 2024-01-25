import {query} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {checkEmailJwtCode} from "./check-email-jwt-code";

const codeValidator = query('code')
    .trim()
    .isString()
    .custom(checkEmailJwtCode)
    .withMessage("Incorrect code");

export const emailQueryCodeValidation = () => [codeValidator, inputModelValidation]
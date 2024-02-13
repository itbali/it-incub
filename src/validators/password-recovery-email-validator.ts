import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const emailValidator = body('email')
    .trim()
    .isEmail()
    .withMessage("Incorrect email");

export const passwordRecoverEmailValidator = () => [emailValidator, inputModelValidation]
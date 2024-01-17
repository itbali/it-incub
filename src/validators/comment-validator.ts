import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const commentBodyValidator = body('content').trim().isString().isLength({min: 20, max: 300}).withMessage("Incorrect content");

export const commentValidation = () => [commentBodyValidator, inputModelValidation]
import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const likeStatusValidation = body('likeStatus').isString().isIn(["Like", "Dislike", "None"]).withMessage("Incorrect likeStatus");

export const likeStatusValidator = () => {
    return [likeStatusValidation, inputModelValidation];
}
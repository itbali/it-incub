import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

const nameValidation = body('name')
    .trim()
    .isString()
    .isLength({min: 1, max: 15})
    .withMessage("Incorrect name");

const descriptionsValidation = body('description')
    .trim()
    .isString()
    .isLength({min: 1, max: 500})
    .withMessage("Incorrect description");

const websiteUrlValidation = body('websiteUrl')
    .trim()
    .isString()
    .isLength({min: 1, max: 100})
    .matches("^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$")
    .withMessage("Incorrect websiteUrl");

export const blogValidation = () => {
    return [nameValidation, descriptionsValidation, websiteUrlValidation, inputModelValidation];
}

import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {BlogRepository} from "../repositories/blog-repository";

const titleValidator = body('title')
    .trim()
    .isString()
    .isLength({min: 1, max: 30})
    .withMessage("Incorrect title");

const shortDescriptionValidator = body('shortDescription')
    .exists({ values: "falsy" })
    .trim()
    .isString()
    .isLength({min: 1, max: 100})
    .withMessage("Incorrect shortDescription");

const contentValidator = body('content')
    .trim()
    .isString()
    .isLength({min: 1, max: 1000})
    .withMessage("Incorrect content");

const blogIdValidator = body('blogId')
    .trim()
    .isString()
    .custom(
        async (value: string)=>{
        if (!await new BlogRepository().getBlogById(value)) {
            throw Error("Incorrect blogId");
        } return true;
    })
    .withMessage("Incorrect blogId");

export const postValidation = () => {
    return [titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator, inputModelValidation];
}

export const createPostInBlogValidation = () => {
    return [titleValidator, shortDescriptionValidator, contentValidator, inputModelValidation];
}
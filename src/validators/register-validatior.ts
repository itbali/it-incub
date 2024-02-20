import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {userService} from "../composition-roots/user-composition";

export const registerLoginValidator = body('login')
    .trim()
    .isLength({min: 3, max: 10})
    .matches(/^[a-zA-Z0-9_-]*$/)
    .custom(async (login: string) => {
        const user = await userService.getUserByEmailOrLogin(login)
        if(user){
            throw Error("Incorrect login");
        }
        return true
    })
    .withMessage("Incorrect login")

export const registerEmailValidator = body('email')
    .trim()
    .isEmail()
    .custom(async (email: string) => {
        const user = await userService.getUserByEmailOrLogin(email)
        if(user){
            throw Error("Incorrect email");
        }
        return true
    })
    .withMessage("Incorrect email")

export const registerPasswordValidator = body('password')
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage("Incorrect password")

export const registerValidation = () => {
    return [registerLoginValidator, registerEmailValidator, registerPasswordValidator, inputModelValidation]
}
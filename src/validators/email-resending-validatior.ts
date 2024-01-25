import {body} from "express-validator";
import {userService} from "../services/user-service";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";

export const emailValidator = body('email')
    .trim()
    .isEmail()
    .custom(async (email: string) => {
        const user = await userService.getUserByEmailOrLogin(email)
        if(!user || user.isConfirmed){
            throw Error("Incorrect email");
        }
        return true
    })
    .withMessage("Incorrect email");

export const emailResendingValidator = () => [emailValidator, inputModelValidation]
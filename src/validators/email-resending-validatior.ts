import {body} from "express-validator";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {userService} from "../composition-roots/user-composition";

const emailValidator = body('email')
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
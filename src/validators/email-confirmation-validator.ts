import {body} from "express-validator";
import {JwtService} from "../application/jwt-service";
import {JwtPayload} from "jsonwebtoken";
import {inputModelValidation} from "../middlewares/input-model-validation/input-model-validation";
import {userService} from "../services/user-service";

export const codeValidator = body('code')
    .trim()
    .isString()
    .custom(async (confirmCode: string) => {
        const valid = JwtService.verifyJwtToken(confirmCode)
        if(!valid){
            throw Error("Incorrect code");
        }
        const {data:email} = JwtService.decodeJwtToken(confirmCode) as JwtPayload
        if(!email){
            throw Error("Incorrect code");
        }
        const user = await userService.getUserByEmailOrLogin(email)
        if(!user || user.isConfirmed){
            throw Error("Incorrect code");
        }
        return true;
    })
    .withMessage("Incorrect code");

export const emailConfirmationValidator = () => [codeValidator, inputModelValidation]
import {Request, Response, NextFunction} from "express";
import {ValidationError, validationResult} from "express-validator";

export const inputModelValidation = (req: Request,res: Response, next: NextFunction) => {
    const formattedErrors = validationResult(req).formatWith((error: ValidationError) => {
        if(error.type === "field") {
            return {
                message: error.msg,
                field: error.path,
            }
        }
        return {
            message: error.msg,
            field: "Unknown",
        }
    });

    if(!formattedErrors.isEmpty()) {
        const errors = formattedErrors.array();
        res.status(400).send({
            errorsMessages: errors
        });
        return;
    }
    next();
}
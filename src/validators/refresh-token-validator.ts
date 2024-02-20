import {Request,Response,NextFunction} from "express";
import {jwtService} from "../composition-roots/security-composition";

export const refreshTokenValidator = (req: Request,res: Response,next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken ||!jwtService.verifyJwtToken(refreshToken)) {
        res.sendStatus(401);
        return;
    }
    next();
}
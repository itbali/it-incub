import {Request,Response,NextFunction} from "express";
import {JwtService} from "../application/jwt-service";

export const refreshTokenValidator = (req: Request,res: Response,next: NextFunction)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken ||!JwtService.verifyJwtToken(refreshToken)) {
        res.sendStatus(401);
        return;
    }
    next();
}
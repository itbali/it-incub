import {Request, Response, NextFunction} from 'express'
import {IpRememberRepository} from "../../repositories/ip-remember-repository";
export function fixEachRequest(req: Request,_res: Response,next: NextFunction){
    new IpRememberRepository().saveRequestIp(req.ip!, req.url);
    next()
}
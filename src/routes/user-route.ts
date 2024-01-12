import {Router, Request, Response} from "express";
import {userService} from "../services/user-service";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {RequestWithBody, RequestWithQuery} from "../models/common/RequestTypes";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {UserCreateModel} from "../models/users/input";
import {userValidation} from "../validators/user-validator";

export const userRoute = Router();

userRoute.get("/",authMiddleware, async (req: RequestWithQuery<getUserQueryParams>, res: Response)=>{
    const users = await userService.getAllUsers({
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        pageSize: req.query.pageSize,
        pageNumber: req.query.pageNumber,
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm
    })
    res.send(users)
})
userRoute.post("/", authMiddleware, userValidation, async (req: RequestWithBody<UserCreateModel>, res: Response)=>{
    const createdUser = await userService.createUser({
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    })
    if(!createdUser){
        res.sendStatus(400)
        return
    }
    res.send(createdUser)
})
userRoute.delete("/:id", authMiddleware, async (req: Request<{id:string}>, res: Response)=>{
    const deletedUser = await userService.deleteUser(req.params.id)
    if(!deletedUser){
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
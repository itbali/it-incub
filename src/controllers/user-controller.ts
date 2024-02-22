import {Request, Response} from "express";
import {RequestWithBody, RequestWithQuery} from "../models/common/RequestTypes";
import {getUserQueryParams} from "../models/users/getUserQueryParams";
import {UserService} from "../services/user-service";
import {UserCreateModel} from "../models/auth/input";
import {inject, injectable} from "inversify";

@injectable()
export class UserController {

    constructor(@inject(UserService) private userService: UserService) {
    }
    async getAllUsers(req: RequestWithQuery<getUserQueryParams>, res: Response) {
        const users = await this.userService.getAllUsers({
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageSize: req.query.pageSize,
            pageNumber: req.query.pageNumber,
            searchLoginTerm: req.query.searchLoginTerm,
            searchEmailTerm: req.query.searchEmailTerm
        })
        res.send(users)
    }

    async createUser(req: RequestWithBody<UserCreateModel>, res: Response) {
        const createdUser = await this.userService.createUser({
            email: req.body.email,
            login: req.body.login,
            password: req.body.password
        })
        if (!createdUser) {
            res.sendStatus(400)
            return
        }
        res.status(201).send(createdUser)
    }

    async deleteUser(req: Request<{ id: string }>, res: Response) {
        const deletedUser = await this.userService.deleteUser(req.params.id)
        if (!deletedUser) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}
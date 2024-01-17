import {Router, Request, Response} from "express";
import {CommentService} from "../services/comment-service";
import {RequestWithParamsAndBody} from "../models/common/RequestTypes";
import {CommentCreateModel} from "../models/comments/input";
import {jwtMiddleware} from "../middlewares/auth/jwt-middleware";

export const commentRoute = Router();

commentRoute.get("/:id", async (req: Request<{ id: string }>, res) => {
    const id = req.params.id;
    const comment = await CommentService.getCommentById(id);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    res.send(comment);
})
commentRoute.put("/:id", jwtMiddleware, async (req: RequestWithParamsAndBody<{
    id: string
}, CommentCreateModel>, res: Response) => {
    const id = req.params.id;
    const userId = req.userId;
    const commentUserId = await CommentService.getCommentUserId(id);
    if (commentUserId !== userId) {
        res.sendStatus(403);
        return;
    }
    const content = req.body.content;
    const comment = await CommentService.updateComment(id, content);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
})
commentRoute.delete("/:id", jwtMiddleware, async (req: Request<{ id: string }>, res) => {
    const id = req.params.id;
    const userId = req.userId;
    const commentUserId = await CommentService.getCommentUserId(id);
    const comment = await CommentService.deleteComment(id);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    if (commentUserId !== userId) {
        res.sendStatus(403);
        return;
    }
    res.sendStatus(204);
})
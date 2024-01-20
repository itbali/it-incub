import {Router, Request, Response} from "express";
import {CommentService} from "../services/comment-service";
import {RequestWithParamsAndBody} from "../models/common/RequestTypes";
import {CommentCreateModel} from "../models/comments/input";
import {jwtMiddleware} from "../middlewares/auth/jwt-middleware";
import {commentValidation} from "../validators/comment-validator";

export const commentRoute = Router();

commentRoute.get("/:id", async (req: Request<{ id: string }>, res) => {
    const id = req.params.id;
    const findCommentResult = await CommentService.getCommentById(id);
    if ("error" in findCommentResult) {
        if (findCommentResult.error === "not_found") {
            res.sendStatus(404);
            return;
        }
    }
    res.send(findCommentResult);
})
commentRoute.put("/:id", jwtMiddleware, commentValidation(), async (req: RequestWithParamsAndBody<{
    id: string
}, CommentCreateModel>, res: Response) => {
    const id = req.params.id;
    const content = req.body.content;

    const updateResult = await CommentService.updateComment(id, content, req.userId!);

    if ("error" in updateResult) {
        if (updateResult.error === "not_found") {
            res.sendStatus(404);
            return;
        }
        if (updateResult.error === "forbidden") {
            res.sendStatus(403);
            return;
        }
    }

    res.sendStatus(204);
})
commentRoute.delete("/:id", jwtMiddleware, async (req: Request<{ id: string }>, res) => {
    const id = req.params.id;
    const deleteResult = await CommentService.deleteComment(id, req.userId!);

    if ("error" in deleteResult) {
        if (deleteResult.error === "not_found") {
            res.sendStatus(404);
            return;
        }
        if (deleteResult.error === "forbidden") {
            res.sendStatus(403);
            return;
        }
    }

    res.sendStatus(204);
})
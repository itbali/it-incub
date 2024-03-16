import {Request, Response} from "express";
import {CommentService} from "../services/comment-service";
import {RequestWithParamsAndBody} from "../models/common/RequestTypes";
import {CommentCreateModel} from "../models/comments/input";
import {LikeStatus} from "../schemas/commentDB";
import {inject, injectable} from "inversify";

@injectable()
export class CommentController {

    constructor(@inject(CommentService) protected commentService: CommentService) {
    }
    async getComment(req: Request<{ id: string }>, res: Response) {
        const id = req.params.id;
        const userId = req.userId || undefined;
        const findCommentResult = await this.commentService.getCommentById(id, userId);
        if ("error" in findCommentResult) {
            if (findCommentResult.error === "not_found") {
                res.sendStatus(404);
                return;
            }
        }
        res.send(findCommentResult);
    }

    async updateComment(req: RequestWithParamsAndBody<{ id: string }, CommentCreateModel>, res: Response) {
        const id = req.params.id;
        const content = req.body.content;

        const updateResult = await this.commentService.updateComment(id, content, req.userId!);

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
    }

    async deleteComment(req: Request<{ id: string }>, res: Response) {
        const id = req.params.id;
        const deleteResult = await this.commentService.deleteComment(id, req.userId!);

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
    }

    async likeComment(req:RequestWithParamsAndBody<{ id: string }, { likeStatus: LikeStatus }>, res: Response) {
        const id = req.params.id;
        const likeStatus = req.body.likeStatus;

        const likeResult = await this.commentService.likeComment(id, req.userId!, likeStatus);

        if ("error" in likeResult) {
            if (likeResult.error === "not_found") {
                res.sendStatus(404);
                return;
            }
            if (likeResult.error === "forbidden") {
                res.sendStatus(403);
                return;
            }
        }
        res.sendStatus(204);
    }
}
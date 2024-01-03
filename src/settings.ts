import express, {Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "./RequestTypes";
import {CreateVideoRequest, Error, Resolution, UpdateVideoRequest, VideoDbType} from "./SettingsTypes";

export const app = express();
app.use(express.json());

let videos: VideoDbType[] = [{
    id: 0,
    title: "string",
    author: "string",
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: "2024-01-02T11:31:55.621Z",
    publicationDate: "2024-01-02T11:31:55.621Z",
    availableResolutions: [Resolution.P144]
}]

app.get("/videos", (_req: Request, res: Response) => {
    res.send(videos);
});

app.get("/videos/:id", (req: RequestWithParams<{ id: string }>, res: Response) => {
    const video = videos.find(video => video.id === Number(req.params.id));
    if (video) {
        res.send(video);
    } else {
        res.status(404).send("Not found");
    }
});

app.post("/videos", (req: RequestWithBody<CreateVideoRequest>, res: Response) => {
    let {title, author, availableResolutions} = req.body;

    let error: Error = {
        errorMessages: []
    }

    if (typeof title !== "string" || !title?.trim() || title.length > 40) {
        error.errorMessages.push({
            field: "title",
            message: "Invalid title"
        })
    }
    if (typeof author !== "string" || !author?.trim() || author.length > 20) {
        error.errorMessages.push({
            field: "author",
            message: "Invalid author"
        })
    }
    if (Array.isArray(availableResolutions)) {
        if (
            !availableResolutions?.every(
                resolution => Object.values(Resolution).includes(resolution)
            )
        ) {
            error.errorMessages.push({
                field: "availableResolutions",
                message: "Invalid resolutions"
            });
        }
    } else {
        availableResolutions = [];
    }

    if (error.errorMessages.length) {
        res.status(400).send(error)
        return;
    }

    const createdAt = new Date();
    const publicationDate = new Date()
    publicationDate.setDate(createdAt.getDate() + 1)

    const video: VideoDbType = {
        id: +new Date(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        availableResolutions,
        title,
        author,
    }
    videos.push(video);
    res.status(201).send(video);
})

app.put("/videos/:id", (req: RequestWithParamsAndBody<{ id: string }, UpdateVideoRequest>, res: Response) => {
    const foundVideo = videos.find(video => video.id === Number(req.params.id));
    if (!foundVideo) {
        res.send(404);
        return;
    }

    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body;

    let error: Error = {
        errorMessages: []
    }

    if (canBeDownloaded && typeof canBeDownloaded !== "boolean") {
        error.errorMessages.push({
            field: "canBeDownloaded",
            message: "Invalid can be downloaded"
        })
    }

    if (minAgeRestriction !== undefined && (typeof minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        error.errorMessages.push({
            field: "minAgeRestriction",
            message: "Invalid min age restriction"
        })
    }

    if (publicationDate && typeof publicationDate !== "string") {
        error.errorMessages.push({
            field: "publicationDate",
            message: "Invalid publication date"
        })
    }

    if (typeof title !== "string" || !title?.trim() || title.length > 40) {
        error.errorMessages.push({
            field: "title",
            message: "Invalid title"
        })
    }
    if (typeof author !== "string" || !author?.trim() || author.length > 20) {
        error.errorMessages.push({
            field: "author",
            message: "Invalid author"
        })
    }
    if (!Array.isArray(availableResolutions) ||
        !availableResolutions?.length ||
        !availableResolutions?.every(
            resolution => Object.values(Resolution).includes(resolution)
        )
    ) {
        error.errorMessages.push({
            field: "availableResolutions",
            message: "Invalid resolutions"
        });
    }

    if (error.errorMessages.length) {
        res.status(400).send(error)
        return;
    }

    foundVideo.title = title;
    foundVideo.author = author;
    foundVideo.availableResolutions = availableResolutions;
    if (canBeDownloaded !== undefined) {
        foundVideo.canBeDownloaded = canBeDownloaded;
    }
    if (minAgeRestriction !== undefined) {
        foundVideo.minAgeRestriction = minAgeRestriction;
    }
    if (publicationDate !== undefined) {
        foundVideo.publicationDate = publicationDate;
    }

    videos = videos.map(video => {
        if (video.id === Number(req.params.id)) {
            return foundVideo;
        }
        return video;
    })
    res.send(204);
})

app.delete("/videos/:id", (req: RequestWithParams<{ id: string }>, res: Response) => {
    const videoIndex = videos.findIndex(video => video.id === Number(req.params.id));
    if (videoIndex === -1) {
        res.send(404);
        return;
    }
    videos.splice(videoIndex, 1);
    res.send(204);
})

app.delete("/testing/all-data", (_req: Request, res: Response) => {
    videos.splice(0, videos.length);
    res.status(204).send("All data is deleted");
})

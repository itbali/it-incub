import request from "supertest"
import {app} from "../src/settings";

describe("test app ", () => {

	beforeAll(async () => {
		await request(app).delete("/testing/all-data")
	});

	it("get return 200 and empty array", async () => {
		await request(app).get("/videos/").expect(200, [])
	})

	it("post create video with correct data", async () => {
		const createdVideoResponse = await request(app)
			.post("/videos/")
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(201)

		expect(createdVideoResponse.body).toEqual({
			id: expect.any(Number),
			title: "Video 1",
			author: "Author 1",
			createdAt: expect.any(String),
			publicationDate: expect.any(String),
			availableResolutions: [],
			canBeDownloaded: false,
			minAgeRestriction: null
		})

		const allVideosResponse = await request(app).get("/videos/").expect(200)
		expect(allVideosResponse.body).toEqual([createdVideoResponse.body])
	})

	it("post return 400 if title is empty", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "",
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "title",
						message: "Invalid title"
					}
				]
			})
	})

	it("post return 400 if title is not string", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: 1,
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "title",
						message: "Invalid title"
					}
				]
			})
	})

	it("post return 400 if title is too long", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "Video 1".repeat(10),
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "title",
						message: "Invalid title"
					}
				]
			})
	})

	it("post return 400 if author is empty", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "Video 1",
				author: "",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "author",
						message: "Invalid author"
					}
				]
			})
	})

	it("post return 400 if author is not string", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "Video 1",
				author: 1,
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "author",
						message: "Invalid author"
					}
				]
			})
	})

	it("post return 400 if author is too long", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "Video 1",
				author: "Author 1".repeat(10),
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "author",
						message: "Invalid author"
					}
				]
			})
	})

	it("post return 400 if resolutions are invalid", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160", "P4320"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "availableResolutions",
						message: "Invalid resolutions"
					}
				]
			})
	})

	it("post return 400 if resolutions are not array", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: "P144",
			})
			.expect(400, {
				errorMessages: [
					{
						field: "availableResolutions",
						message: "Invalid resolutions"
					}
				]
			})
	})

	it("post return 400 if resolutions are empty", async () => {
		await request(app)
			.post("/videos/")
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: []
			})
			.expect(400, {
				errorMessages: [
					{
						field: "availableResolutions",
						message: "Invalid resolutions"
					}
				]
			})
	})

	it("put return 204 and update video with correct data", async () => {
		const videoId = (await request(app).get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "New Video 1",
				author: "New Author 1",
				availableResolutions: ["P144"],
			})
			.expect(204)

		const createdVideoResponse = await request(app)
			.get(`/videos/${videoId}`)
			.expect(200)

		expect(createdVideoResponse.body).toEqual({
			id: videoId,
			title: "New Video 1",
			author: "New Author 1",
			createdAt: expect.any(String),
			publicationDate: expect.any(String),
			availableResolutions: ["P144"],
			canBeDownloaded: false,
			minAgeRestriction: null
		})
	})

	it("put return 400 if title is empty", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "",
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "title",
						message: "Invalid title"
					}
				]
			})
	})

	it("put return 400 if title is not string", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: 1,
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "title",
						message: "Invalid title"
					}
				]
			})
	})

	it("put return 400 if title is too long", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1".repeat(10),
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "title",
						message: "Invalid title"
					}
				]
			})
	})

	it("put return 400 if author is empty", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "author",
						message: "Invalid author"
					}
				]
			})
	})

	it("put return 400 if author is not string", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: 1,
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "author",
						message: "Invalid author"
					}
				]
			})
	})

	it("put return 400 if author is too long", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1".repeat(10),
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "author",
						message: "Invalid author"
					}
				]
			})
	})

	it("put return 400 if resolutions are invalid", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160", "P4320"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "availableResolutions",
						message: "Invalid resolutions"
					}
				]
			})
	})

	it("put return 400 if resolutions are not array", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: "P144",
			})
			.expect(400, {
				errorMessages: [
					{
						field: "availableResolutions",
						message: "Invalid resolutions"
					}
				]
			})
	})

	it("put return 400 if resolutions are empty", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: []
			})
			.expect(400, {
				errorMessages: [
					{
						field: "availableResolutions",
						message: "Invalid resolutions"
					}
				]
			})
	})

	it("put return 400 if canBeDownloaded is not boolean", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app)
			.put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				canBeDownloaded: "true",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "canBeDownloaded",
						message: "Invalid can be downloaded"
					}
				]
			})
	})

	it("put return 400 if minAgeRestriction is not number", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app).put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				minAgeRestriction: "1",
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "minAgeRestriction",
						message: "Invalid min age restriction"
					}
				]
			})
	})

	it("put return 400 if minAgeRestriction is less than 1", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app).put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				minAgeRestriction: 0,
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "minAgeRestriction",
						message: "Invalid min age restriction"
					}
				]
			})
	})

	it("put return 400 if minAgeRestriction is more than 18", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app).put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				minAgeRestriction: 19,
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "minAgeRestriction",
						message: "Invalid min age restriction"
					}
				]
			})
	})

	it("put return 400 if publicationDate is not string", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app).put(`/videos/${videoId}`)
			.send({
				title: "Video 1",
				author: "Author 1",
				publicationDate: 1,
				availableResolutions: ["P144"],
			})
			.expect(400, {
				errorMessages: [
					{
						field: "publicationDate",
						message: "Invalid publication date"
					}
				]
			})
	})

	it("put return 404 if id is not number", async () => {
		await request(app).put(`/videos/abc`)
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(404)
	})

	it("put return 404 if id is empty", async () => {
		await request(app).put(`/videos/`)
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(404)
	})

	it("put return 404 if video is not found", async () => {
		await request(app).put(`/videos/999`)
			.send({
				title: "Video 1",
				author: "Author 1",
				availableResolutions: ["P144"],
			})
			.expect(404)
	})

	it("delete return 204 and delete video", async () => {
		const videoId = (await request(app)
			.get("/videos/")).body[0].id

		await request(app).delete(`/videos/${videoId}`).expect(204)

		const allVideosResponse = await request(app).get("/videos/").expect(200)
		expect(allVideosResponse.body).toEqual([])
	})

})

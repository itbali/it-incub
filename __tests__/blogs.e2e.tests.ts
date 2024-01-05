import request from "supertest"
import {app} from "../src/settings";

describe("test app ", () => {

	const credentials = Buffer.from('admin:qwerty').toString('base64');
	const authHeader = `Basic ${credentials}`;
	beforeAll(async () => {
		await request(app).delete("/testing/all-data")
	});

	it("get return 200 and empty array", async () => {
		await request(app).get("/blogs/").expect(200, [])
	})

	it("post return 200 and created blog", async () => {
		const blog = {
			name: "test",
			websiteUrl: "https://www.example.com/path/to/resource",
			description: "lorem ipsum dolor sit amet"
		}
		const response = await request(app)
			.post("/blogs/")
			.set("Authorization", authHeader)
			.send(blog)

		console.log(response)
		expect(response.body).toMatchObject(blog)

		const allBlogs = await request(app).get("/blogs/").expect(200)
		expect(allBlogs.body).toHaveLength(1)
		expect(allBlogs.body[0]).toMatchObject(blog)
	})
})

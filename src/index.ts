import {app} from "./settings";
import {runDb} from "./db/db";

const port = process.env.PORT || 3001;

app.listen(port, async () => {
	console.log(`Listening on port ${port}`);
	await runDb();
});

import {app} from "./settings";
import {runDb} from "./db/db";

const port = process.env.PORT || 3001;

app.set('trust proxy', true)
const startApp = async () => {
	await runDb();
	console.log('DB connected');
	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

startApp();

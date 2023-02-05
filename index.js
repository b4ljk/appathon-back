import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.get("/sisi", (req, res) => {
	// console log request header
	console.log(req.headers);
	const unitId = req.query.unitId;
	console.log(unitId);
	axios.post(`https://stud-api.num.edu.mn/topMenus/units?unitid=${unitId}`).then((response) => {
		res.send(response.data);
	});
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

app.use((req, res, next) => {
	res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Example app listening at http://0.0.0.0:${port}`);
});

import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import sisiroute from "./routes.js";
import calc from "./ap/index.js";

dotenv.config();
const app = express();
const port = 3001;
// allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log("requsted accepted");
  next();
});

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/data", sisiroute);
app.use("/calc", calc);
app.get("/sisi", (req, res) => {
  // console log request header
  const unitId = req.query.unitId;
  if (unitId == null) {
    res.send("unitId is null");
  }

  axios
    .post(`https://stud-api.num.edu.mn/topMenus/units?unitid=${unitId}`)
    .then((response) => {
      res.send(response.data);
    });
  // res.send("Hello World!");
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

import express from "express";
const bodyParser = require("body-parser");
const apicache = require("apicache");

const Router = require("./routes");
const CandleRouter = require("./routes/ptc01_Routes");
// const { swaggerDocs: SwaggerDocs } = require("./swagger");
const { ptc01_main } = require("./ptc01_main.ts");
// import { ptc01_main } from './ptc01_main.ts';

const app = express();
const cache = apicache.middleware;
const PORT = process.env.PORT || 3030;

/*
app.get("/", (req, res) => {
    res.send("<h2>It's Working!</h2>");
});
*/

app.use(bodyParser.json());
app.use(cache("2 minutes"));
app.use("/api", Router);
app.use("/api/candles", CandleRouter);

app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
    // SwaggerDocs(app, PORT);
    ptc01_main();
})
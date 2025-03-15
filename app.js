import http from "http";
import config from "./config.js";
import Router from "./router.js";
import httpResp from "./helpers/httpResp.js";

const server = http.createServer();
const router = new Router();

router.post("/echo/:message", (req, res) => {
    res.end(JSON.stringify(req.query) + "\n" + JSON.stringify(req.param));
});

router.all("/*",  httpResp.error404Handler);

server.on("request", (req, res) => {
    try {
        console.log(`server :: ${req.method} - ${req.url}`);
        router.handle(req, res); 
    } catch(e) {
        httpResp.unhandledErrorHandler(req, res, e);
    }
});

server.listen(config.APP_PORT, () => {
    console.log(`server :: listening port ${config.APP_PORT}`);
})
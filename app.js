import http from "http";
import config from "./config.js";
import Router from "./router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";

const server = http.createServer();
const router = new Router();

router.use(corsHandler);
router.use(bodyParser.json);

router.get("/echo/:message", (req, res) => {
    httpResp.Success[200](req, res, "success", {
        query: {...req.query},
        param: {... req.param}
    });
});

router.post("/echo/:message", (req, res) => {
    httpResp.Success[200](req, res, "success", {
        query: {...req.query},
        param: {... req.param},
        body: {...req.body}
    });
});

router.all("/*",  httpResp.Error[404]);

server.on("request", (req, res) => {
    try {
        console.log(`server :: ${req.method} - ${req.url}`);
        router.handle(req, res); 
    } catch(e) {
        httpResp.Error.unhandled(req, res, e);
    }
});

server.listen(process.env.PORT || config.PORT || 3000, () => {
    console.log(`server :: listening port ${config.APP_PORT}`);
});

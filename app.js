import http from "http";
import Router from "./router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";

import categoryController from "./controllers/category.js";

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_SSL:", process.env.DB_SSL);
console.log("Server running on PORT:", process.env.PORT || 3000);

const server = http.createServer();
const router = new Router();

router.use(corsHandler);
router.use(bodyParser.json);

// Test
router.get("/echo/:message", (req, res) => {
    httpResp.Success[200](req, res, {
        query: {...req.query},
        param: {... req.param}
    });
});

router.post("/echo/:message", (req, res) => {
    httpResp.Success[200](req, res, {
        query: {...req.query},
        param: {... req.param},
        body: {...req.body}
    });
});

// Category
router.get("/category", categoryController.getAll);
router.get("/category/:id", categoryController.getOne);
router.post("/category", categoryController.createOne);
router.patch("/category/:id", categoryController.updateOne);
router.delete("/category/:id", categoryController.deleteOne);

// *
router.all("/*",  httpResp.Error[404]);

server.on("request", (req, res) => {
    try {
        console.log(`server :: ${req.method} - ${req.url}`);
        router.handle(req, res); 
    } catch(e) {
        httpResp.Error.default(req, res, e);
    }
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`server :: listening port ${process.env.PORT || 3000}`);
});

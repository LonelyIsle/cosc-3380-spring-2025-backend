import http from "http";
import Router from "./helpers/router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";
import auth from "./helpers/auth.js";

import testController from "./controllers/test.js";
import categoryController from "./controllers/category.js";
import customerController from "./controllers/customer.js";

const server = http.createServer();
const router = new Router();

router.use(corsHandler);
router.use(bodyParser.json);

// Test
router.get("/test/db", testController.testDb);
router.get("/test/echo/:message", testController.echoGet);
router.post("/test/echo/:message", testController.echoPost);
router.post("/test/jwt", auth.isLogin(), testController.jwt);
router.get("/test/which", testController.which);

// Category
router.get("/category", categoryController.getAll);
router.get("/category/:id", categoryController.getOne);
router.post("/category", categoryController.createOne);
router.patch("/category/:id", categoryController.updateOne);
router.delete("/category/:id", categoryController.deleteOne);

// Customer
router.post("/register", customerController.register);
router.post("/login", customerController.login);

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
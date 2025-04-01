import http from "http";
import Router from "./helpers/router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";
import auth from "./helpers/auth.js";

import testController from "./controllers/test.js";
import categoryController from "./controllers/category.js";
import customerController from "./controllers/customer.js";
import employeeController from "./controllers/employee.js";
import productController from "./controllers/product.js";

const server = http.createServer();
const router = new Router();

router.use(corsHandler);
router.use(bodyParser.json);

// Test
router.get("/test/db", testController.testDb);
router.get("/test/echo/:message", testController.echoGet);
router.post("/test/echo/:message", testController.echoPost);
router.post("/test/jwt", auth.is(auth.CUSTOMER, auth.STAFF, auth.MANAGER), testController.jwt);
router.get("/test/which", testController.which);
router.get("/test/kill", testController.kill);

// Customer
router.get("/customer/:id", auth.is(auth.CUSTOMER, auth.MANAGER), customerController.getOne);
router.post("/customer/forget/question", customerController.getForgetQuestion);
router.post("/customer/forget", customerController.forget);
router.post("/customer/register", customerController.register);
router.post("/customer/login", customerController.login);

// Employee
router.get("/employee/:id", auth.is(auth.STAFF, auth.MANAGER), employeeController.getOne);
router.post("/employee/login", employeeController.login);

// Product
router.get("/product", productController.getAll);
router.get("/product/:id", productController.getOne);

// Category
router.get("/category", categoryController.getAll);
router.get("/category/:id", categoryController.getOne);
router.post("/category", auth.is(auth.MANAGER), categoryController.createOne);
router.patch("/category/:id", auth.is(auth.MANAGER), categoryController.updateOne);
router.delete("/category/:id", auth.is(auth.MANAGER), categoryController.deleteOne);

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
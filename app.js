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
import couponController from "./controllers/coupon.js";
import configController from "./controllers/config.js";
import saleEventController from "./controllers/saleEvent.js";
import subscriptionController from "./controllers/subscription.js";
import orderController from "./controllers/order.js";
import notificationController from "./controllers/notification.js";

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
router.post("/customer/forget/question", customerController.getQuestion);
router.post("/customer/forget", customerController.forget);
router.post("/customer/register", customerController.register);
router.post("/customer/login", customerController.login);
router.post("/customer/subscription", auth.is(auth.CUSTOMER), subscriptionController.createOne);
router.patch("/customer/:id", auth.is(auth.CUSTOMER), customerController.updateOne);
router.patch("/customer/:id/password", auth.is(auth.CUSTOMER), customerController.updatePassword);
router.patch("/customer/:id/qa", auth.is(auth.CUSTOMER), customerController.updateQuestionAndAnswer);

// Employee
router.get("/employee/:id", auth.is(auth.STAFF, auth.MANAGER), employeeController.getOne);
router.post("/employee/login", employeeController.login);

// Notification
router.get("/notification", auth.is(auth.STAFF, auth.MANAGER), notificationController.getAll);
router.get("/notification/:id", auth.is(auth.STAFF, auth.MANAGER), notificationController.getOne);
router.patch("/notification/:id", auth.is(auth.STAFF, auth.MANAGER), notificationController.updateOne);

// Product
router.get("/product", productController.getAll);
router.get("/product/:id", productController.getOne);

// Category
router.get("/category", categoryController.getAll);
router.get("/category/:id", categoryController.getOne);
router.post("/category", auth.is(auth.MANAGER), categoryController.createOne);
router.patch("/category/:id", auth.is(auth.MANAGER), categoryController.updateOne);
router.delete("/category/:id", auth.is(auth.MANAGER), categoryController.deleteOne);

// Coupon
router.get("/coupon/:code/active", couponController.getOneActiveByCode);

// Sale Event
router.get("/sale-event/one/active", saleEventController.getOneActive);

// Order
router.get("/order", auth.is(auth.CUSTOMER, auth.STAFF, auth.MANAGER), orderController.getAll);
router.get("/order/:id", auth.is(auth.CUSTOMER, auth.STAFF, auth.MANAGER), orderController.getOne);
router.post("/order", auth.is(auth.GUEST, auth.CUSTOMER), orderController.createOne);
router.patch("/order/:id", auth.is(auth.STAFF, auth.MANAGER), orderController.updateOne);

// Config
router.get("/config", configController.getAll);
router.patch("/config", auth.is(auth.MANAGER), configController.updateAll);

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
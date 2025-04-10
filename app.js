import http from "http";
import Router from "./helpers/router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";
import auth from "./helpers/auth.js";
import multer from "multer";

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

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Global handlers
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
router.get("/customer", auth.is(auth.MANAGER), customerController.getAll);
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
router.get("/employee", auth.is(auth.MANAGER), employeeController.getAll);
router.get("/employee/:id", auth.is(auth.STAFF, auth.MANAGER), employeeController.getOne);
router.post("/employee/login", employeeController.login);
router.post("/employee", auth.is(auth.MANAGER), employeeController.createOne);
router.patch("/employee/:id", auth.is(auth.MANAGER), employeeController.updateOne);
router.patch("/employee/:id/password", auth.is(auth.STAFF, auth.MANAGER), employeeController.updatePassword);

// Notification
router.get("/notification", auth.is(auth.STAFF, auth.MANAGER), notificationController.getAll);
router.get("/notification/:id", auth.is(auth.STAFF, auth.MANAGER), notificationController.getOne);
router.patch("/notification/:id", auth.is(auth.STAFF, auth.MANAGER), notificationController.updateOne);

// Product
router.get("/product", productController.getAll);
router.get("/product/:id", productController.getOne);
router.post("/product", auth.is(auth.STAFF, auth.MANAGER), productController.createOne);
router.patch("/product/:id", auth.is(auth.STAFF, auth.MANAGER), productController.updateOne);
router.patch("/product/:id/image", auth.is(auth.STAFF, auth.MANAGER), upload.single("image"), productController.updateOneImage)
router.delete("/product/:id", auth.is(auth.STAFF, auth.MANAGER), productController.deleteOne);

// Category
router.get("/category", categoryController.getAll);
router.get("/category/:id", categoryController.getOne);
router.post("/category", auth.is(auth.STAFF, auth.MANAGER), categoryController.createOne);
router.patch("/category/:id", auth.is(auth.STAFF, auth.MANAGER), categoryController.updateOne);
router.delete("/category/:id", auth.is(auth.STAFF, auth.MANAGER), categoryController.deleteOne);

// Coupon
router.get("/coupon/:code/active", couponController.getOneActiveByCode);
router.get("/coupon", auth.is(auth.MANAGER), couponController.getAll);
router.get("/coupon/:id", auth.is(auth.MANAGER), couponController.getOne);
router.post("/coupon", auth.is(auth.MANAGER), couponController.createOne);
router.patch("/coupon/:id", auth.is(auth.MANAGER), couponController.updateOne);

// Sale Event
router.get("/sale-event/one/active", saleEventController.getOneActive);
router.get("/sale-event", auth.is(auth.MANAGER), saleEventController.getAll);
router.get("/sale-event/:id", auth.is(auth.MANAGER), saleEventController.getOne);
router.post("/sale-event", auth.is(auth.MANAGER), saleEventController.createOne);
router.patch("/sale-event/:id", auth.is(auth.MANAGER), saleEventController.updateOne);

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
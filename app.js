import http from "http";
import Router from "./router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";
import testController from "./controllers/test.js";
import categoryController from "./controllers/category.js";

console.log("=== Azure Web App Startup: app.js running ===");
let pool;

try {
  pool = (await import("./controllers/db.js")).default;

  pool.query("SELECT 1", (err, result) => {
    if (err) {
      console.error("❌ DB connection failed on startup:", err);
    } else {
      console.log("✅ DB connection verified on Azure Web App startup.");
    }
  });
} catch (err) {
  console.error("❌ Failed to initialize database pool:", err);
}

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_SSL:", process.env.DB_SSL);
console.log("Server running on PORT:", process.env.PORT || 3000);

const server = http.createServer();
const router = new Router();

router.use(corsHandler);
router.use(bodyParser.json);

// Test
router.get("/test/db", testController.testDb);
router.get("/test/echo/:message", testController.echoGet);
router.post("/test/echo/:message", testController.echoPost);

// Category
router.get("/category", categoryController.getAll);
router.get("/category/:id", categoryController.getOne);
router.post("/category", categoryController.createOne);
router.patch("/category/:id", categoryController.updateOne);
router.delete("/category/:id", categoryController.deleteOne);

// *
router.get("/health", (req, res) => {
  res.statusCode = 200;
  res.end("Healthy");
});
router.all("/*",  httpResp.Error[404]);

server.on("request", (req, res) => {
    try {
        console.log(`server :: ${req.method} - ${req.url}`);
        router.handle(req, res); 
    } catch(e) {
        httpResp.Error.default(req, res, e);
    }
});
console.log("Preparing to start server...");
server.listen(process.env.PORT || 3000, () => {
    console.log(`server :: listening port ${process.env.PORT || 3000}`);
});

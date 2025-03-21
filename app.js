import http from "http";
import Router from "./router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";

import testController from "./controllers/test.js";
import categoryController from "./controllers/category.js";

import pool from "./controllers/db.js";

// Use Azure-assigned port or fallback
const PORT = process.env.PORT || 3000;

// ✅ Confirm ENV values
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_SSL:", process.env.DB_SSL);
console.log("Using PORT:", PORT);

// ✅ Test DB connection
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Database connection successful:", rows);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // only exit if DB fails
  }
})();

// Set up server and router
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
router.all("/*",  httpResp.Error[404]);

// Start server and log
const server = http.createServer((req, res) => {
  try {
    console.log(`server :: ${req.method} - ${req.url}`);
    router.handle(req, res);
  } catch (e) {
    httpResp.Error.default(req, res, e);
  }
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 server :: listening on http://0.0.0.0:${PORT}`);
});

import http from "http";
import Router from "./router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";

import testController from "./controllers/test.js";
import categoryController from "./controllers/category.js";

import pool from "./controllers/db.js";

const PORT = process.env.PORT || 3000;

// ✅ Confirm ENV values
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_SSL:", process.env.DB_SSL);
console.log("Using PORT:", PORT);

// Initialize router
const router = new Router();
router.use(corsHandler);
router.use(bodyParser.json);

// Test routes
router.get("/test/db", testController.testDb);
router.get("/test/echo/:message", testController.echoGet);
router.post("/test/echo/:message", testController.echoPost);

// Category routes
router.get("/category", categoryController.getAll);
router.get("/category/:id", categoryController.getOne);
router.post("/category", categoryController.createOne);
router.patch("/category/:id", categoryController.updateOne);
router.delete("/category/:id", categoryController.deleteOne);

// Catch-all for 404s
router.all("/*", httpResp.Error[404]);

// ✅ DB check and then start server
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1");
    console.log("✅ Database connection successful:", rows);

    const server = http.createServer((req, res) => {
      try {
        console.log(`server :: ${req.method} - ${req.url}`);
        router.handle(req, res);
      } catch (e) {
        httpResp.Error.default(req, res, e);
      }
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
})();

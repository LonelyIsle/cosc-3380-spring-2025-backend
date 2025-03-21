import "dotenv/config"; // Load .env variables
import http from "http";
import Router from "./router.js";
import httpResp from "./helpers/httpResp.js";
import corsHandler from "./helpers/cors.js";
import bodyParser from "./helpers/bodyParser.js";
import testController from "./controllers/test.js";
import categoryController from "./controllers/category.js";
import pool from "./controllers/db.js";
import authenticateToken from "./helpers/auth.js";

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate environment variables
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined in environment variables!");
  process.exit(1);
}

console.log("✅ Loaded environment variables:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_SSL:", process.env.DB_SSL);
console.log("Using PORT:", PORT);

// Initialize Router
const router = new Router();
router.use(corsHandler);
router.use("/category", authenticateToken);
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

// ✅ Database Connection & Start Server
// ✅ Ensure a working DB connection
(async () => {
  try {
   // const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT 1");
    connection.release();

    console.log("✅ DB connected:", rows);

    const server = http.createServer(router.handle.bind(router));
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();


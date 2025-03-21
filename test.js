import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();


console.log("Testing Database Connection...");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_SSL:", process.env.DB_SSL);

const useSSL = process.env.DB_SSL && typeof process.env.DB_SSL === "string" 
    ? process.env.DB_SSL.toLowerCase() === "true" 
    : false;

// Create a temporary database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD, 
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: useSSL ? { rejectUnauthorized: false } : false
});

// Attempt to connect
connection.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to Azure MySQL successfully!");
        // Run a simple test query
        connection.query("SHOW TABLES;", (err, results) => {
            if (err) {
                console.error("❌ Query failed:", err);
            } else {
                console.log("✅ Database Tables:", results);
            }
            connection.end(); 
        });
    }
});
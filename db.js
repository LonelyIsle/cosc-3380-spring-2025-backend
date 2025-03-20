import mysql from "mysql2";

const useSSL = process.env.DB_SSL && typeof process.env.DB_SSL === "string" 
    ? process.env.DB_SSL.toLowerCase() === "true" 
    : false;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: useSSL ? { rejectUnauthorized: false } : false
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to Azure MySQL!");
    connection.release();
  }
});

export default pool;
import mysql from 'mysql2/promise';
import httpResp from "../helpers/httpResp.js";

let config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit : 20,
}

if (process.env.DB_SSL.toLowerCase() === "true") {
    config.ssl = {
        rejectUnauthorized: false
    }
}

const pool = mysql.createPool(config);

async function tx(req, res, func) {
    try {
        var conn = await pool.getConnection();
        await conn.beginTransaction();
        
        let data = await func(conn);
        
        await conn.commit();
        httpResp.Success[200](req, res, data);
    } catch(e) {
        conn && await conn.rollback();
        httpResp.Error.default(req, res, e);
    } finally {
        conn && conn.release();
    }
}

export default {
    config,
    pool,
    tx
};
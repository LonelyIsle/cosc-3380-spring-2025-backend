import db from "./db.js";
import httpResp from "../helpers/httpResp.js";

function echoPost(req, res)  {
    httpResp.Success[200](req, res, {
        query: {...req.query},
        param: {... req.param},
        body: {...req.body}
    });
}

function echoGet(req, res)  {
    httpResp.Success[200](req, res, {
        query: {...req.query},
        param: {... req.param}
    });
}

async function testDb(req, res) {
    let _config = JSON.parse(JSON.stringify(db.config));
    _config.password = 'X'.repeat(_config.password.length);
    try {
        var conn = await db.pool.getConnection();
        await conn.beginTransaction();

        await conn.commit();
        httpResp.Success[200](req, res, {
            dbConnection: "success",
            dbConfig: _config
        });
    } catch(e) {
        conn && await conn.rollback();
        httpResp.Success[200](req, res, {
            dbConnection: "error",
            dbConfig: _config,
            dbError: e.stack
        });
    } finally {
        conn && conn.release();
    }
}

async function listTables(req, res) {
    try {
        const [rows] = await db.pool.query("SHOW TABLES");
        httpResp.Success[200](req, res, {
            tables: rows
        });
    } catch (e) {
        httpResp.Error.default(req, res, e);
    }
}

export default {
    echoPost,
    echoGet,
    testDb,
    listTables
}

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

function jwt(req, res) {
    httpResp.Success[200](req, res, req.jwt);
}

function which(req, res) {
    httpResp.Success[200](req, res, { version: "3" });
}

function kill(req, res) {
    if (req.query.confirm === "yes") {
        httpResp.Success[200](req, res, "good bye");
        process.exit();
    } else {
        httpResp.Success[200](req, res, "please confirm");
    }
}

export default {
    echoPost,
    echoGet,
    testDb,
    jwt,
    which,
    kill
}
import categoryModel from "../models/category.js";
import pool from "./db.js";
import httpResp from "../helpers/httpResp.js";

async function createOne(req, res, next) {
    let conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
        let body = req.body;
        let { rows } = await categoryModel.createOne(conn, body);
        await conn.commit();
        httpResp.Success[200](req, res, rows)
    } catch(e) {
        await conn.rollback();
        httpResp.Error.default(req, res, e);
    } finally {
        conn.release();
    }
}


export default {
    createOne
}
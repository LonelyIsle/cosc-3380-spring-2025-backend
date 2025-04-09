import productModel from "../models/product.js";
import db from "./db.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let data = await productModel.getAll(conn, query, { include: true });
        return data;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let product = await productModel.getOne(conn, param.id, { include: true });
        return product;
    });
}

async function createOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let  productId  = await productModel.createOne(conn, body);
        let product = await productModel.getOne(conn, productId, { include: true })
        return product;
    });
}
export default {
    getAll,
    getOne,
    createOne
}
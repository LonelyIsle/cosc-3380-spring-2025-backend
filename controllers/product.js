import productModel from "../models/product.js";
import db from "./db.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let data = await productModel.getAll(conn, true);
        return data;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let product = await productModel.getOne(conn, param.id, true);
        return product;
    });
}

export default {
    getAll,
    getOne
}
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
        let productId = await productModel.createOne(conn, body);
        let product = await productModel.getOne(conn, productId, { include: true })
        return product;
    });
}

async function updateOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        let productId = await productModel.updateOne(conn, body);
        let product = await productModel.getOne(conn, productId, { include: true })
        return product;
    });
}

async function updateOneImage(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        body.image = req.file;
        let productId = await productModel.updateOneImage(conn, body);
        let product = await productModel.getOne(conn, productId, { include: true });
        return product;
    });
}

async function deleteOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        await productModel.deleteOne(conn, param.id);
        return null;
    });
}

export default {
    getAll,
    getOne,
    createOne,
    updateOne,
    updateOneImage,
    deleteOne
}
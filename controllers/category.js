import categoryModel from "../models/category.js";
import db from "./db.js";

async function getAll(req, res, next) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let data = await categoryModel.getAll(conn, query);
        return data;
    })
}

async function getOne(req, res, next) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let category = await categoryModel.getOne(conn, param.id);
        return category;
    })
}

async function createOne(req, res, next) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let  categoryId  = await categoryModel.createOne(conn, body);
        let category = await categoryModel.getOne(conn, categoryId)
        return category;
    })
}

async function updateOne(req, res, next) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        let  categoryId = await categoryModel.updateOne(conn, body);
        let category = await categoryModel.getOne(conn, categoryId)
        return category;
    })
}

async function deleteOne(req, res, next) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let result = await categoryModel.deleteOne(conn, param.id);
        return null;
    })
}


export default {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
}
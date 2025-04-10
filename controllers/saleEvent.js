import saleEventModel from "../models/saleEvent.js";
import db from "./db.js";

async function getOneActive(req, res) {
    await db.tx(req, res, async (conn) => {
        let saleEvent = await saleEventModel.getOneActive(conn, { include: true });
        return saleEvent;
    });
}

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let data = await saleEventModel.getAll(conn, query, { include: true });
        return data;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let saleEvent = await saleEventModel.getOne(conn, param.id, { include: true });
        return saleEvent;
    });
}

async function createOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let  saleEventId = await saleEventModel.createOne(conn, body);
        let saleEvent = await saleEventModel.getOne(conn, saleEventId, { include: true });
        return saleEvent;
    });
}

async function updateOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        let  saleEventId = await saleEventModel.updateOne(conn, body);
        let saleEvent = await saleEventModel.getOne(conn, saleEventId, { include: true });
        return saleEvent;
    });
}

export default {
    getOneActive,
    getAll,
    getOne,
    createOne,
    updateOne
}
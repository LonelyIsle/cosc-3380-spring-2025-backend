import orderModel from "../models/order.js";
import db from "./db.js";
import auth from "../helpers/auth.js";
import { HttpError } from "../helpers/error.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let rows = [];
        if (req.jwt.user.role === auth.CUSTOMER) {
            rows = await orderModel.getAllByCustomerId(conn, req.jwt.user.id, query, { include: true });
        } else {
            rows = await orderModel.getAll(conn, query, { include: true });
        }
        return rows;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let orderId = req.param.id;
        let order = await orderModel.getOneByCustomerId(conn, req.jwt.user.id, orderId, { include: true });
        return order;
    });
}

async function createOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        if (req.jwt) {
            body.customer_id = req.jwt.user.id;
        }
        let orderId = await orderModel.createOne(conn, body);
        let order = await orderModel.getOne(conn, orderId, { include: true });
        return order;
    });
}

async function updateOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        let orderId = await orderModel.updateOne(conn, body);
        let order = await orderModel.getOne(conn, orderId, { include: true });
        return order;
    });
}

export default {
    getAll,
    getOne,
    createOne,
    updateOne
}
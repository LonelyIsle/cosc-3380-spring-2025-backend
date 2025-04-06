import orderModel from "../models/order.js";
import db from "./db.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let rows = await orderModel.getAll(conn);
        return rows;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let orderId = req.param.id;
        let order = await orderModel.getOne(conn, orderId);
        return order;
    });
}

async function createOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        if (req.jwt) {
            body.customer_id  = req.jwt.user.id;
        }
        let orderId = await orderModel.createOne(conn, body);
        let order = await orderModel.getOne(conn, orderId);
        return order;
    });
}

export default {
    getAll,
    getOne,
    createOne
}
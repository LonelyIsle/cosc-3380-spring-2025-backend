import orderModel from "../models/order.js";
import db from "./db.js";
import auth from "../helpers/auth.js";
import { HttpError } from "../helpers/error.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let rows = await orderModel.getAll(conn, { include: true });
        return rows;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let orderId = req.param.id;
        if (req.jwt.user.role === auth.CUSTOMER) {
            let orderIds = await orderModel.getManyIdByCustomerId(conn, req.jwt.user.id);
            if (orderId && orderIds.indexOf(orderId) < 0) {
                throw new HttpError({ statusCode: 401 });
            }
        }
        let order = await orderModel.getOne(conn, orderId, { include: true });
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
        let order = await orderModel.getOne(conn, orderId, { include: true });
        return order;
    });
}

export default {
    getAll,
    getOne,
    createOne
}
import notificationModel from "../models/notification.js";
import { HttpError } from "../helpers/error.js";
import db from "./db.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let data = await notificationModel.getAllByEmployeeId(conn, req.jwt.user.id, query, { include: true });
        return data;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let notification = await notificationModel.getOneByEmployeeId(conn, req.jwt.user.id, param.id, { include: true });
        return notification;
    });
}

async function updateOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        body.employee_id = req.jwt.user.id;
        let notification = await notificationModel.getOneByEmployeeId(conn, body.employee_id, body.id);
        if (!notification) {
            throw new HttpError({ statusCode: 401 });
        }
        let notificationId = await notificationModel.updateOne(conn, body);
        notification = await notificationModel.getOne(conn, notificationId, { include: true });
        return notification;
    });
}

export default {
    getAll,
    getOne,
    updateOne,
}
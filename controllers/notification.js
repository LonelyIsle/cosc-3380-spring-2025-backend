import notificationModel from "../models/notification.js";
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
        let  notificationId = await notificationModel.updateOneByEmployeeId(conn, body);
        let notification = await notificationModel.getOneByEmployeeId(conn, body.employee_id, notificationId)
        return notification;
    });
}

export default {
    getAll,
    getOne,
    updateOne,
}
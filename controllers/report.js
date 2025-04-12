import reportModel from "../models/report.js";
import db from "./db.js";

async function getOrderProductReport(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let rows = await reportModel.getOrderProductReport(conn, query);
        return rows;
    });
}

async function getOrderCouponReport(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let rows = await reportModel.getOrderCouponReport(conn, query);
        return rows;
    });
}

async function getOrderCustomerReport(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let rows = await reportModel.getOrderCustomerReport(conn, query);
        return rows;
    });
}

export default {
    getOrderProductReport,
    getOrderCouponReport,
    getOrderCustomerReport
}
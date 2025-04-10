import couponModel from "../models/coupon.js";
import db from "./db.js";

async function getOneActiveByCode(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let coupon = await couponModel.getOneActiveByCode(conn, param.code);
        return coupon;
    });
}

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let data = await couponModel.getAll(conn, query);
        return data;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let coupon = await couponModel.getOne(conn, param.id);
        return coupon;
    });
}

async function createOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let couponId = await couponModel.createOne(conn, body);
        let coupon = await couponModel.getOne(conn, couponId)
        return coupon;
    });
}

async function updateOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        let couponId = await couponModel.updateOne(conn, body);
        let coupon = await couponModel.getOne(conn, couponId)
        return coupon;
    });
}

export default {
    getOneActiveByCode,
    getAll,
    getOne,
    createOne,
    updateOne
}
import couponModel from "../models/coupon.js";
import db from "./db.js";

async function getOneActiveByCode(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let coupon = await couponModel.getOneActiveByCode(conn, param.code);
        return coupon;
    });
}

export default {
    getOneActiveByCode
}
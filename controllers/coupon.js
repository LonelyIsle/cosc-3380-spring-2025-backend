import couponModel from "../models/coupon.js";
import db from "./db.js";

async function getOneByCode(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let coupon = await couponModel.getOneByCode(conn, param.code);
        return coupon;
    });
}

export default {
    getOneByCode
}
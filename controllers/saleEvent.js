import saleEventModel from "../models/saleEvent.js";
import db from "./db.js";

async function getOneActive(req, res) {
    await db.tx(req, res, async (conn) => {
        let saleEvent = await saleEventModel.getOneActive(conn, { include: true });
        return saleEvent;
    });
}

export default {
    getOneActive
}
import saleEventModel from "../models/saleEvent.js";
import db from "./db.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let data = await saleEventModel.getAll(conn);
        return data;
    });
}

export default {
    getAll
}
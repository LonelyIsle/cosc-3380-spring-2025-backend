import configModel from "../models/config.js";
import db from "./db.js";
import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let rows = await configModel.getAll(conn);
        let configObj = {};
        for (let row of rows) {
            let [val] = utils.parseStr(row.value)
            configObj[row.key] = val;
        }
        return configObj;
    });
}

export default {
    getAll
}
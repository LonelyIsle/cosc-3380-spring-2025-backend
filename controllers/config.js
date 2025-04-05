import configModel from "../models/config.js";
import db from "./db.js";
import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let config = await configModel.getAll(conn);
        return config;
    });
}

export default {
    getAll
}
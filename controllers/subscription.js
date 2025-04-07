import subscriptionModel from "../models/subscription.js";
import configModel from "../models/config.js";
import db from "./db.js";

async function createOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        body.customer_id  = req.jwt.user.id;
        let subscriptionId  = await subscriptionModel.createOne(conn, body);
        let subscription = await subscriptionModel.getOne(conn, subscriptionId);
        return subscription;
    });
}

export default {
    createOne   
}
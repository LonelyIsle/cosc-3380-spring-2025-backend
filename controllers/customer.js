import customerModel from "../models/customer.js";
import db from "./db.js";
import jwt from "../helpers/jwt.js";
import { HttpError } from "../helpers/error.js";
import auth from "../helpers/auth.js";

async function register(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let data = await customerModel.createOne(conn, body);
        return data;
    });
}

async function login(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let customer = await customerModel.getOneByEmailAndPwd(conn, body.email, body.password);
        if (customer) {
            delete customer.password;
            customer.token = jwt.sign({
                id: customer.id,
                email: customer.email,
                role: auth.CUSTOMER
            });
        } else {
            throw new HttpError({ statusCode: 400, message: "Wrong email or password." })
        }
        return customer;
    });
}

export default {
    register,
    login
}
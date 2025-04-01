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

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        if (req.jwt.user.role === auth.CUSTOMER && req.jwt.user.id !== param.id) {
            throw new HttpError({ statusCode: 401 });
        }
        let customer = await customerModel.getOne(conn, param.id);
        if (customer) {
            delete customer.password;
            customer.role = auth.CUSTOMER;
        }
        return customer;
    });
}


export default {
    register,
    login,
    getOne
}
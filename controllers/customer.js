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
            delete customer.reset_password_answer;
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

async function getQuestion(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let customer = await customerModel.getOneByEmail(conn, body.email);
        if (!customer) {
            throw new HttpError({ statusCode: 400, message: "Email is invalid." })
        }
        return {
            reset_password_question: customer.reset_password_question
        };
    });
}

async function forget(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let customer = await customerModel.getOneByEmailAndAnswer(conn, body.email, body.reset_password_answer);
        if (!customer) {
            throw new HttpError({ statusCode: 400, message: "Wrong email or answer." })
        }
        let data = await customerModel.updatePassword(conn, customer.id, body.password);
        return null;
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
            delete customer.reset_password_answer;
            customer.role = auth.CUSTOMER;
        }
        return customer;
    });
}

async function updateOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        if (req.jwt.user.id !== param.id) {
            throw new HttpError({ statusCode: 401 });
        }
        let  customerId = await customerModel.updateOne(conn, body);
        let customer = await customerModel.getOne(conn, customerId)
        if (customer) {
            delete customer.password;
            delete customer.reset_password_answer;
        }
        return customer;
    });
}


async function updatePassword(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        if (req.jwt.user.id !== param.id) {
            throw new HttpError({ statusCode: 401 });
        }
        let data = await customerModel.updatePassword(conn, body.id, body.password);
        return null;
    });
}

async function updateQuestionAndAnswer(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        if (req.jwt.user.id !== param.id) {
            throw new HttpError({ statusCode: 401 });
        }
        let data = await customerModel.updateQuestionAndAnswer(conn, body.id, body.reset_password_question, body.reset_password_answer);
        return null;
    });
}

export default {
    register,
    login,
    getOne,
    getQuestion,
    forget,
    updateOne,
    updatePassword,
    updateQuestionAndAnswer
}
import customerModel from "../models/customer.js";
import subscriptionModel from "../models/subscription.js";
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
        let customer = await customerModel.getOneByEmailAndPwd(
            conn, 
            body.email, 
            body.password, 
            { include: true }
        );
        if (customer) {
            customerModel.prepare(customer);
            customer.token = jwt.sign({
                id: customer.id,
                email: customer.email,
                role: customer.role
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
        let customer = await customerModel.getOne(conn, param.id, { include: true });
        switch (req.jwt.user.role) {
            case auth.CUSTOMER:
                customerModel.prepare(customer);
                break;
            case auth.MANAGER:
                customerModel.prepareStrict(customer);
                break;
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
        let customerId = await customerModel.updateOne(conn, body);
        let customer = await customerModel.getOne(conn, customerId, { include: true });
        customerModel.prepare(customer);
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

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let data = await customerModel.getAll(conn, query, { include: true });
        for (let customer of data.rows) {
            customerModel.prepareStrict(customer);
        }
        return data;
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
    updateQuestionAndAnswer,
    getAll
}
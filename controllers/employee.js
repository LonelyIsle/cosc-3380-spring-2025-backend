import employeeModel from "../models/employee.js";
import db from "./db.js";
import jwt from "../helpers/jwt.js";
import { HttpError } from "../helpers/error.js";
import auth from "../helpers/auth.js";

async function login(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let employee = await employeeModel.getOneByEmailAndPwd(conn, body.email, body.password);
        if (employee) {
            employeeModel.prepare(employee);
            employee.token = jwt.sign({
                id: employee.id,
                email: employee.email,
                role: employee.role
            });
        } else {
            throw new HttpError({ statusCode: 400, message: "Wrong email or password." })
        }
        return employee;
    });
}

async function getAll(req, res) {
    await db.tx(req, res, async (conn) => {
        let query = req.query;
        let data = await employeeModel.getAllStaff(conn, query);
        employeeModel.prepare(data.rows);
        return data;
    });
}

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        let employee = null;
        if (req.jwt.user.id === param.id) {
            employee = await employeeModel.getOne(conn, param.id);
            employeeModel.prepare(employee);
        } else {
            if (req.jwt.user.role !== auth.MANAGER) {
                throw new HttpError({ statusCode: 401 });
            } else {
                employee = await employeeModel.getOneStaff(conn, param.id);
                employeeModel.prepare(employee);
            }
        }
        return employee;
    });
}

async function updatePassword(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        if (req.jwt.user.id === param.id) {
            await employeeModel.updatePassword(conn, body.id, body.password);
        } else {
            if (req.jwt.user.role !== auth.MANAGER) {
                throw new HttpError({ statusCode: 401 });
            } else {
                let employee = await employeeModel.getOne(conn, body.id);
                if (!employee || employee.role !== auth.STAFF) {
                    throw new HttpError({ statusCode: 401 });
                }
                await employeeModel.updatePassword(conn, body.id, body.password);
            }
        }
        return null;
    });
}

async function updateOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        let employee = null;
        body.id = param.id;
        if (req.jwt.user.id === param.id) {
            throw new HttpError({ statusCode: 401 });
        } else {
            if (req.jwt.user.role !== auth.MANAGER) {
                throw new HttpError({ statusCode: 401 });
            } else {
                employee = await employeeModel.getOne(conn, body.id);
                if (!employee || employee.role !== auth.STAFF) {
                    throw new HttpError({ statusCode: 401 });
                }
                delete body.role;
                let employeeId = await employeeModel.updateOne(conn, body);
                employee = await employeeModel.getOne(conn, employeeId);
                employeeModel.prepare(employee);
            }
        }
        return employee;
    });
}

async function createOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        body.role = auth.STAFF;
        let data = await employeeModel.createOne(conn, body);
        return data;
    });
}

async function deleteOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let body = req.body;
        let param = req.param;
        body.id = param.id;
        if (req.jwt.user.id === param.id) {
            throw new HttpError({ statusCode: 401 });
        } else {
            let employee = await employeeModel.getOne(conn, body.id);
            if (!employee || employee.role !== auth.STAFF) {
                throw new HttpError({ statusCode: 401 });
            }
            await employeeModel.deleteOne(conn, body.id);
        }
        return null;
    });
}

export default {
    login,
    getAll,
    getOne,
    updatePassword,
    updateOne,
    createOne,
    deleteOne
}
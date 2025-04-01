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
            delete employee.password;
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

async function getOne(req, res) {
    await db.tx(req, res, async (conn) => {
        let param = req.param;
        if (req.jwt.user.role === auth.STAFF && req.jwt.user.id !== param.id) {
            throw new HttpError({ statusCode: 401 });
        }
        let employee = await employeeModel.getOne(conn, param.id);
        if (employee) {
            delete employee.password;
        }
        return employee;
    });
}

export default {
    login,
    getOne
}